# Generated by Django 5.1.6 on 2025-02-22 17:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0003_rename_quiz_question_quiz_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='quiz_id',
            new_name='quiz',
        ),
        migrations.RenameField(
            model_name='userresponse',
            old_name='quiz_id',
            new_name='quiz',
        ),
    ]
