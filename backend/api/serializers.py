from rest_framework import serializers
from .models import Student, Attendance


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'roll_no', 'department', 'email', 'created_at', 'updated_at']


class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_roll_no = serializers.CharField(source='student.roll_no', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_name', 'student_roll_no', 'date', 'status', 'time', 'created_at', 'updated_at']
