from django.urls import path
from .views import GenerateQuizView, SubmitAnswersView

urlpatterns = [
    path("generate/", GenerateQuizView.as_view(), name="generate-quiz"),
    path("answers/", SubmitAnswersView.as_view(), name="submit-answers"),
]