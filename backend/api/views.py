from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from datetime import date, datetime
from .models import Student, Attendance
from .serializers import StudentSerializer, AttendanceSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            students = Student.objects.filter(
                Q(name__icontains=query) |
                Q(roll_no__icontains=query) |
                Q(department__icontains=query) |
                Q(email__icontains=query)
            )
        else:
            students = Student.objects.all()
        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        date_str = request.query_params.get('date', str(date.today()))
        attendances = Attendance.objects.filter(date=date_str)
        serializer = self.get_serializer(attendances, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        today = str(date.today())
        total_students = Student.objects.count()
        today_attendances = Attendance.objects.filter(date=today)
        present = today_attendances.filter(status='Present').count()
        absent = today_attendances.filter(status='Absent').count()
        late = today_attendances.filter(status='Late').count()
        
        if total_students > 0:
            attendance_rate = round(((present + late) / total_students) * 100, 2)
        else:
            attendance_rate = 0

        return Response({
            'total_students': total_students,
            'present_today': present,
            'absent_today': absent,
            'late_today': late,
            'attendance_rate': attendance_rate,
        })

    @action(detail=False, methods=['get'])
    def report(self, request):
        date_str = request.query_params.get('date', str(date.today()))
        attendances = Attendance.objects.filter(date=date_str)
        
        total = attendances.count()
        present = attendances.filter(status='Present').count()
        absent = attendances.filter(status='Absent').count()
        late = attendances.filter(status='Late').count()

        serializer = self.get_serializer(attendances, many=True)
        return Response({
            'date': date_str,
            'total': total,
            'present': present,
            'absent': absent,
            'late': late,
            'records': serializer.data,
        })
