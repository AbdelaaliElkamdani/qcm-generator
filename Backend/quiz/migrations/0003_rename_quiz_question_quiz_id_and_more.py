# Generated by Django 5.1.6 on 2025-02-22 16:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0002_quiz_remove_question_language_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='quiz',
            new_name='quiz_id',
        ),
        migrations.RenameField(
            model_name='userresponse',
            old_name='quiz',
            new_name='quiz_id',
        ),
    ]
