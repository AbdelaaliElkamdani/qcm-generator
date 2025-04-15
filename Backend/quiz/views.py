from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Quiz, Question, UserResponse
from .serializers import QuizSerializer
import google.generativeai as genai
import re
import xml.etree.ElementTree as ET

# Configure Gemini
genai.configure(api_key="your gemini api key")

def clean_xml(raw_text):
    """
    Nettoie le texte pour s'assurer qu'il contient uniquement du XML valide.
    """
    cleaned_text = re.sub(r"^.*?<quiz>", "<quiz>", raw_text, flags=re.DOTALL)
    cleaned_text = re.sub(r"</quiz>.*?$", "</quiz>", cleaned_text, flags=re.DOTALL)
    cleaned_text = re.sub(r"<!--.*?-->", "", cleaned_text, flags=re.DOTALL)
    cleaned_text = re.sub(r"\s+", " ", cleaned_text).strip()
    return cleaned_text

def convert_xml_to_json(xml_string):
    try:
        root = ET.fromstring(xml_string)
        questions = []

        for q in root.findall("question"):
            question_text = q.find("text").text
            options = [opt.text for opt in q.find("options").findall("option")]
            correct_answers = [ans.text for ans in q.find("correct_answers").findall("answer")]
            question_type = q.get("type", "single")

            questions.append({
                "text": question_text,
                "options": options,
                "correct_answers": correct_answers,
                "question_type": question_type
            })

        return questions

    except ET.ParseError as e:
        print(f"Erreur de parsing XML : {str(e)}")
        return []

class GenerateQuizView(APIView):
    def post(self, request):
        data = request.data

        try:

            topic = data.get("topic")
            file = data.get("file")
            num_questions = data.get("num_questions", 5)
            language = data.get("language", "fr")
            question_type = data.get("question_type", "single")

            content = topic

            if file:
                try:
                    if file.page_count > 10:
                        return Response({"error": "Seuls les fichiers de 10 pages maximum sont acceptés"}, status=status.HTTP_400_BAD_REQUEST)
                    with open(file.path, "rb") as f:
                        content = f.read().decode("utf-8")
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            prompt = f"""
            Génère {num_questions} questions QCM en {language} de type {question_type} à partir du sujet suivant :
            {content}
            
            **IMPORTANT :**
            - Retourne UNIQUEMENT un XML valide au format suivant :
            ```xml
            <quiz>
                <question type="{question_type}">
                    <text>Quelle est la capitale de la France?</text>
                    <options>
                        <option>Paris</option>
                        <option>Londres</option>
                        <option>Berlin</option>
                        <option>Madrid</option>
                    </options>
                    <correct_answers>
                        <answer>Paris</answer>
                    </correct_answers>
                </question>
            </quiz>
            ```
            - Ne génère AUCUN texte supplémentaire en dehors du XML.
            - Chaque question doit avoir 4 options.
            - Chaque question doit avoir des réponses correctes selon le type de question indiqué dans le XML.
            """

            response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)

            xml_content = clean_xml(response.text)

            questions = convert_xml_to_json(xml_content)

            if not questions:
                return Response({"error": "Impossible de générer un QCM pour le moment veuillez essayer plus tard"}, status=status.HTTP_400_BAD_REQUEST)
            
            quiz = Quiz.objects.create(topic=topic, num_questions=num_questions, language=language, question_type=question_type)

            for q in questions:
                Question.objects.create(quiz=quiz , **q)

            return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SubmitAnswersView(APIView):
    def post(self, request):
        data = request.data


        if not isinstance(data, dict):
            return Response({"error": "Invalid request format"}, status=status.HTTP_400_BAD_REQUEST)

        quiz_id = data.get("quiz_id")

        user_answers = data.get("answers")

        if quiz_id is None:
            return Response({"error": "Missing quiz_id"}, status=status.HTTP_400_BAD_REQUEST)

        if user_answers is None:
            return Response({"error": "Missing answers"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quiz = Quiz.objects.get(id=quiz_id)
            questions = Question.objects.filter(quiz=quiz)

            if not questions.exists():
                return Response({"error": "No questions found for this quiz"}, status=status.HTTP_400_BAD_REQUEST)

            user_answers_dict = {str(answer["id"]): answer["answer"] for answer in user_answers}

            score = self.calculate_score(questions, user_answers_dict)

            index = (score*100) / questions.count()


            if index >= 80:

                UserResponse.objects.create(quiz=quiz, user_answers=user_answers_dict, score=score, status="excellent")
                return Response({"score": score, "status": "excellent"}, status=status.HTTP_200_OK)

            if index >= 70:
                UserResponse.objects.create(quiz=quiz, user_answers=user_answers_dict, score=score, status="good")
                return Response({"score": score, "status": "good"}, status=status.HTTP_200_OK)

            if index >= 60:
                UserResponse.objects.create(quiz=quiz, user_answers=user_answers_dict, score=score, status="passing")
                return Response({"score": score, "status": "passing"}, status=status.HTTP_200_OK)
            
            if score >= 50:
                UserResponse.objects.create(quiz=quiz, user_answers=user_answers_dict, score=score, status="passing")
                return Response({"score": score, "status": "acceptable"}, status=status.HTTP_200_OK)
            
            UserResponse.objects.create(quiz=quiz, user_answers=user_answers_dict, score=score, status="zero")

            return Response({"score": score, "status": "zero"}, status=status.HTTP_200_OK)

        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def calculate_score(self, questions, user_answers_dict):
        correct = 0

        for question in questions:
            user_responses = user_answers_dict.get(str(question.id), None)


            if user_responses is None:
                continue

            if set(question.correct_answers) == set(user_responses):
                correct += 1    

        return correct
    