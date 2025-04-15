from django.db import models

class Quiz(models.Model):
    topic = models.CharField(max_length=255)
    num_questions = models.IntegerField()
    language = models.CharField(max_length=50,default='fr')
    question_type = models.CharField(max_length=20, choices=[('single', 'Single Choice'), ('multiple', 'Multiple Choice')])
    created_at = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    text = models.TextField()
    options = models.JSONField()
    correct_answers = models.JSONField()
    question_type = models.CharField(max_length=20)

class UserResponse(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user_answers = models.JSONField()  # Réponses de l'utilisateur
    score = models.FloatField()
    status = models.CharField(max_length=20, default='passing', choices=[
        ('passing', 'Passing'),
        ('good', 'Good'),
        ('excellent', 'Excellent'),
        ('zero', 'Zero'),
    ])
