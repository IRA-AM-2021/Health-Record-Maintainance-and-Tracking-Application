# Generated by Django 3.2 on 2021-07-03 04:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patientsview', '0006_auto_20210701_0742'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientshistory',
            name='description',
            field=models.TextField(),
        ),
    ]
