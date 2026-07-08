from django.contrib import admin
from .models import Student, Attendance


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['name', 'roll_no', 'department', 'email', 'created_at']
    search_fields = ['name', 'roll_no', 'department', 'email']
    list_filter = ['department', 'created_at']


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'date', 'status', 'time', 'created_at']
    search_fields = ['student__name', 'student__roll_no']
    list_filter = ['status', 'date']
    date_hierarchy = 'date'
