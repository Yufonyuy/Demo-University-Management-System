import React, { useState, useEffect, useRef } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'

/* ==================== UTILS & CONFIG ==================== */
const DB_KEY = 'schmg_v2'
const AUTH_KEY = 'schmg_auth_v2'

function gid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(0, 6) }

function getDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) } catch (e) { return null }
}

function saveDB(d) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(d)) } catch (e) {}
}

const TODAY = new Date().toISOString().split('T')[0]
const DEPTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Medicine', 'Business Administration']
const LEVELS = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level']
const GENDERS = ['Male', 'Female']
const TERMS = ['First Semester', 'Second Semester']
const CURRENT_YEAR = new Date().getFullYear()
const FACULTIES = [
  { name: 'Faculty of Science', code: 'S', dept: 'Computer Science' },
  { name: 'Faculty of Engineering', code: 'G', dept: 'Electrical Engineering' },
  { name: 'Faculty of Economics', code: 'E', dept: 'Business Administration' },
  { name: 'Faculty of Health Sciences', code: 'H', dept: 'Medicine' },
  { name: 'Faculty of Civil Engineering', code: 'C', dept: 'Civil Engineering' }
]

function ensureSchema(d) {
  if (!d.settings) d.settings = {}
  if (!d.settings.schoolCode) d.settings.schoolCode = 'Uba'
  if (!d.settings.matriculePolicy) d.settings.matriculePolicy = 'School code + admission year + faculty code + 4-digit student number'
  if (!Array.isArray(d.admittedStudents)) d.admittedStudents = []
  if (!d.admittedStudents.find(a => a.matricule === 'Uba23E0312')) {
    d.admittedStudents.push({
      id: gid(),
      name: 'Grace Nchang',
      admissionYear: '2023',
      faculty: 'Faculty of Economics',
      facultyCode: 'E',
      dept: 'Business Administration',
      level: '100 Level',
      sequence: 312,
      matricule: 'Uba23E0312',
      confirmed: true,
      used: false,
      source: 'Sample admitted list'
    })
  }
  saveDB(d)
  return d
}

function initDB() {
  let d = getDB()
  if (d && d.users && d.users.length > 0) return ensureSchema(d)

  const sa = gid(), t1 = gid(), t2 = gid()
  const s1 = gid(), s2 = gid(), s3 = gid()
  const c1 = gid(), c2 = gid(), c3 = gid()

  d = {
    settings: {
      schoolName: 'Genesys',
      motto: 'Excellence in Education',
      academicYear: `${CURRENT_YEAR}/${CURRENT_YEAR + 1}`,
      currentSemester: 'First Semester',
      feeDeadline: '2025-09-15',
      regDeadline: '2025-09-01',
      examStartDate: '2025-11-15',
      examEndDate: '2025-12-05',
      resitDeadline: '2026-01-15',
      schoolCode: 'Uba',
      matriculePolicy: 'School code + admission year + faculty code + 4-digit student number',
      logo: null
    },
    semesters: [
      { id: 'sem-1', name: 'First Semester', year: `${CURRENT_YEAR}/${CURRENT_YEAR + 1}`, startDate: '2025-09-01', endDate: '2026-01-15', active: true },
      { id: 'sem-2', name: 'Second Semester', year: `${CURRENT_YEAR}/${CURRENT_YEAR + 1}`, startDate: '2026-02-01', endDate: '2026-06-15', active: false }
    ],
    users: [
      { id: sa, name: 'Super Admin', email: 'admin@campus.edu', pw: 'admin123', role: 'superadmin', phone: '+1234567890', gender: 'Male', photo: null },
      { id: t1, name: 'Mr. John Smith', email: 'teacher.cs@campus.edu', pw: '123456', role: 'teacher', dept: 'Computer Science', level: '300 Level', phone: '+234800111', gender: 'Male', photo: null },
      { id: t2, name: 'Dr. Ada Johnson', email: 'teacher.ee@campus.edu', pw: '123456', role: 'teacher', dept: 'Electrical Engineering', level: '200 Level', phone: '+234800222', gender: 'Female', photo: null },
      { id: s1, name: 'Rahul Sharma', email: 'rahul@campus.edu', pw: '123456', role: 'student', roll: 'CS-101', dept: 'Computer Science', level: '300 Level', phone: '+234800333', gender: 'Male', photo: null },
      { id: s2, name: 'Priya Singh', email: 'priya@campus.edu', pw: '123456', role: 'student', roll: 'CS-102', dept: 'Computer Science', level: '300 Level', phone: '+234800444', gender: 'Female', photo: null },
      { id: s3, name: 'Amit Kumar', email: 'amit@campus.edu', pw: '123456', role: 'student', roll: 'EE-211', dept: 'Electrical Engineering', level: '200 Level', phone: '+234800555', gender: 'Male', photo: null }
    ],
    courses: [
      { id: c1, code: 'CS301', name: 'Data Structures & Algorithms', credits: 3, dept: 'Computer Science', level: '300 Level', teacherId: t1, semester: 'First Semester', resit: false },
      { id: c2, code: 'CS305', name: 'Database Systems', credits: 3, dept: 'Computer Science', level: '300 Level', teacherId: t1, semester: 'First Semester', resit: false },
      { id: c3, code: 'EE201', name: 'Circuit Analysis', credits: 4, dept: 'Electrical Engineering', level: '200 Level', teacherId: t2, semester: 'First Semester', resit: false }
    ],
    enrollments: [
      { userId: s1, courseId: c1, semester: 'First Semester' },
      { userId: s1, courseId: c2, semester: 'First Semester' },
      { userId: s2, courseId: c1, semester: 'First Semester' },
      { userId: s3, courseId: c3, semester: 'First Semester' }
    ],
    marks: [
      { userId: s1, courseId: c1, score: 88, grade: 'A', semester: 'First Semester', resit: false },
      { userId: s1, courseId: c2, score: 72, grade: 'C', semester: 'First Semester', resit: false },
      { userId: s2, courseId: c1, score: 65, grade: 'D', semester: 'First Semester', resit: false }
    ],
    attendance: [
      { id: gid(), userId: s1, date: TODAY, status: 'Present', time: '09:05' },
      { id: gid(), userId: s2, date: TODAY, status: 'Present', time: '09:07' },
      { id: gid(), userId: s3, date: TODAY, status: 'Absent', time: null }
    ],
    fees: [
      { id: gid(), userId: s1, amount: 150000, paid: 100000, semester: 'First Semester', date: '2025-08-20', status: 'Partial' },
      { id: gid(), userId: s2, amount: 150000, paid: 150000, semester: 'First Semester', date: '2025-08-15', status: 'Paid' }
    ],
    announcements: [
      { id: gid(), title: 'Welcome Back!', body: 'All students are expected to register for courses before the deadline.', date: TODAY, target: 'all', readBy: [] }
    ],
    messages: [],
    admittedStudents: [
      { id: gid(), name: 'Grace Nchang', admissionYear: '2023', faculty: 'Faculty of Economics', facultyCode: 'E', dept: 'Business Administration', level: '100 Level', sequence: 312, matricule: 'Uba23E0312', confirmed: true, used: false, source: 'Sample admitted list' }
    ],
    timetable: [
      { id: gid(), courseId: c1, day: 'Monday', startTime: '09:00', endTime: '11:00', venue: 'Lab 1' },
      { id: gid(), courseId: c2, day: 'Wednesday', startTime: '12:00', endTime: '14:00', venue: 'Room 205' },
      { id: gid(), courseId: c3, day: 'Tuesday', startTime: '10:00', endTime: '12:00', venue: 'Hall A' }
    ],
    auditLog: [
      { id: gid(), action: 'System initialized', user: 'System', date: TODAY, type: 'info' }
    ]
  }
  saveDB(d)
  return d
}

function getGrade(score) {
  if (score >= 90) return 'A'; if (score >= 80) return 'B'; if (score >= 70) return 'C'; if (score >= 60) return 'D'; return 'F'
}

function getGradePoint(grade) {
  return { A: 5, B: 4, C: 3, D: 2, F: 0 }[grade] || 0
}

function loginFn(email, pw) {
  const d = initDB()
  const u = d.users.find(x => x.email === email && x.pw === pw)
  if (u) { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); return u }
  return null
}

function signupFn(data) {
  const d = initDB()
  if (d.users.find(x => x.email === data.email)) return { success: false, msg: 'Email already exists' }
  const matricule = (data.matricule || '').trim()
  const admitted = d.admittedStudents.find(a => a.matricule.toLowerCase() === matricule.toLowerCase())
  if (!admitted) return { success: false, msg: 'Matricule number was not found on the confirmed admitted-students list' }
  if (!admitted.confirmed) return { success: false, msg: 'This matricule number has not been confirmed by the school admin yet' }
  if (admitted.used) return { success: false, msg: 'This matricule number has already been used to create an account' }
  const nu = {
    id: gid(),
    ...data,
    name: admitted.name,
    roll: admitted.matricule,
    matricule: admitted.matricule,
    dept: admitted.dept,
    level: admitted.level,
    faculty: admitted.faculty,
    admissionYear: admitted.admissionYear,
    role: 'student',
    photo: null
  }
  d.users.push(nu); saveDB(d)
  const idx = d.admittedStudents.findIndex(a => a.id === admitted.id)
  if (idx >= 0) {
    d.admittedStudents[idx].used = true
    d.admittedStudents[idx].userId = nu.id
  }
  saveDB(d)
  localStorage.setItem(AUTH_KEY, JSON.stringify(nu))
  return { success: true, user: nu }
}

function getUser() { try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch (e) { return null } }

function logout() { localStorage.removeItem(AUTH_KEY) }

function isDeadlinePassed(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date(TODAY + 'T00:00:00')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ==================== UI COMPONENTS ==================== */
function Badge({ st, type = 'status' }) {
  let cls = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border '
  if (type === 'status') {
    if (st === 'Present') cls += 'bg-green-100 text-green-700 border-green-300'
    else if (st === 'Absent') cls += 'bg-red-100 text-red-700 border-red-300'
    else if (st === 'Late') cls += 'bg-yellow-100 text-yellow-700 border-yellow-300'
    else cls += 'bg-gray-100 text-gray-700 border-gray-300'
  } else if (type === 'grade') {
    if (['A', 'B'].includes(st)) cls += 'bg-green-100 text-green-700 border-green-300'
    else if (['C', 'D'].includes(st)) cls += 'bg-yellow-100 text-yellow-700 border-yellow-300'
    else cls += 'bg-red-100 text-red-700 border-red-300'
  } else if (type === 'role') {
    if (st === 'superadmin') cls += 'bg-purple-100 text-purple-700 border-purple-300'
    else if (st === 'teacher') cls += 'bg-blue-100 text-blue-700 border-blue-300'
    else if (st === 'student') cls += 'bg-gray-100 text-gray-700 border-gray-300'
    else cls += 'bg-gray-100 text-gray-700 border-gray-300'
  } else if (type === 'payment') {
    if (st === 'Paid') cls += 'bg-green-100 text-green-700 border-green-300'
    else if (st === 'Partial') cls += 'bg-yellow-100 text-yellow-700 border-yellow-300'
    else cls += 'bg-red-100 text-red-700 border-red-300'
  } else if (type === 'semester') {
    cls += 'bg-teal-100 text-teal-700 border-teal-300'
  }
  const text = st === 'superadmin' ? 'Super Admin' : st === 'teacher' ? 'Teacher' : st === 'student' ? 'Student' : st
  return <span className={cls}>{text}</span>
}

function StatCard({ title, value, color = 'teal', icon = '' }) {
  const colors = { teal: 'bg-teal-800', green: 'bg-green-600', red: 'bg-red-600', amber: 'bg-amber-500', blue: 'bg-blue-600', purple: 'bg-purple-600', slate: 'bg-slate-700' }
  return (
    <div className={`rounded-xl p-5 text-white shadow-lg ${colors[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 break-words">{value}</p>
        </div>
        {icon && <span className="text-3xl opacity-50">{icon}</span>}
      </div>
    </div>
  )
}

function Button({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) {
  const base = 'px-4 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-teal-800 text-white hover:bg-teal-900 shadow-md',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    accent: 'bg-amber-500 text-white hover:bg-amber-600',
    ghost: 'bg-transparent text-teal-800 hover:bg-teal-50 border border-teal-200',
    outline: 'bg-transparent border-2 border-teal-800 text-teal-800 hover:bg-teal-50'
  }
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>{children}</button>
}

function Input({ label, type = 'text', value, onChange, placeholder, required = false, options = null, rows = null, accept = null, className = '' }) {
  const base = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white'
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      {options ? (
        <select value={value} onChange={onChange} required={required} className={base}>
          <option value="">Select {label}</option>
          {options.map(opt => typeof opt === 'string' ? <option key={opt} value={opt}>{opt}</option> : <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : rows ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows} className={base} />
      ) : accept ? (
        <input type={type} value={value} onChange={onChange} accept={accept} required={required} className={base} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={base} />
      )}
    </div>
  )
}

function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>{children}</div>
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <div className="text-center py-12">
      <span className="text-5xl block mb-4">{icon}</span>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mt-2">{subtitle}</p>}
    </div>
  )
}

function Alert({ type = 'info', children, onClose }) {
  const colors = { info: 'bg-blue-50 text-blue-800 border-blue-200', success: 'bg-green-50 text-green-800 border-green-200', warning: 'bg-amber-50 text-amber-800 border-amber-200', error: 'bg-red-50 text-red-800 border-red-200' }
  return (
    <div className={`flex items-start justify-between p-4 rounded-lg border text-sm mb-4 ${colors[type]}`}>
      <div>{children}</div>
      {onClose && <button onClick={onClose} className="ml-4 font-bold hover:opacity-70">✕</button>}
    </div>
  )
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 overflow-x-auto">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition ${active === tab.id ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function PhotoUpload({ photo, onChange, size = 120 }) {
  const ref = useRef()
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-${size/4} h-${size/4} rounded-full overflow-hidden border-4 border-teal-200 bg-gray-100 flex items-center justify-center`} style={{ width: size, height: size }}>
        {photo ? (
          <img src={photo} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl text-gray-400">👤</span>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={onChange} className="hidden" />
      <Button variant="outline" onClick={() => ref.current.click()} className="text-xs py-2">
        {photo ? 'Change Photo' : 'Upload Photo'}
      </Button>
    </div>
  )
}

function QuickLink({ to, icon, title, desc, color = 'teal' }) {
  const colors = { blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200', teal: 'bg-teal-50 hover:bg-teal-100 border-teal-200', purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200', amber: 'bg-amber-50 hover:bg-amber-100 border-amber-200', slate: 'bg-slate-50 hover:bg-slate-100 border-slate-200', green: 'bg-green-50 hover:bg-green-100 border-green-200', red: 'bg-red-50 hover:bg-red-100 border-red-200' }
  return (
    <Link to={to} className={`p-5 rounded-xl border transition group ${colors[color]}`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </Link>
  )
}

/* ==================== PRINT RESULT PDF ==================== */
function printResultSlip(student, marks, courses, settings) {
  const totalCredits = marks.reduce((a, m) => a + (courses.find(c => c.id === m.courseId)?.credits || 0), 0)
  const gpa = totalCredits ? (marks.reduce((a, m) => a + (getGradePoint(m.grade) * (courses.find(c => c.id === m.courseId)?.credits || 0)), 0) / totalCredits).toFixed(2) : '0.00'
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html><head><title>Result Slip - ${student.name}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
      .header { text-align: center; border-bottom: 3px solid #115e59; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { color: #115e59; margin: 0; }
      .header p { color: #666; margin: 5px 0 0; }
      .info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
      .info div { padding: 10px; background: #f8f9fa; border-radius: 5px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
      th { background: #115e59; color: white; padding: 12px; text-align: left; }
      td { padding: 10px 12px; border-bottom: 1px solid #eee; }
      .grade-a, .grade-b { color: #059669; font-weight: bold; }
      .grade-c, .grade-d { color: #d97706; font-weight: bold; }
      .grade-f { color: #dc2626; font-weight: bold; }
      .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; }
      .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
      @media print { body { padding: 20px; } }
    </style></head><body>
    <div class="header">
      <h1>${settings.schoolName || 'University'}</h1>
      <p>${settings.motto || ''} | Academic Year: ${settings.academicYear}</p>
      <h2 style="margin-top:15px; color:#115e59;">OFFICIAL RESULT SLIP</h2>
    </div>
    <div class="info">
      <div><strong>Student Name:</strong> ${student.name}</div>
      <div><strong>Roll Number:</strong> ${student.roll}</div>
      <div><strong>Department:</strong> ${student.dept}</div>
      <div><strong>Level:</strong> ${student.level}</div>
      <div><strong>Semester:</strong> ${settings.currentSemester || 'N/A'}</div>
      <div><strong>Printed:</strong> ${TODAY}</div>
    </div>
    <table>
      <tr><th>Course Code</th><th>Course Name</th><th>Credits</th><th>Score</th><th>Grade</th><th>Points</th></tr>
      ${marks.map(m => {
        const c = courses.find(x => x.id === m.courseId)
        const gp = getGradePoint(m.grade)
        const gradeClass = m.grade === 'A' || m.grade === 'B' ? 'grade-a' : m.grade === 'C' || m.grade === 'D' ? 'grade-c' : 'grade-f'
        return `<tr><td><strong>${c?.code || '-'}</strong></td><td>${c?.name || '-'}</td><td>${c?.credits || '-'}</td><td>${m.score}</td><td class="${gradeClass}">${m.grade}${m.resit ? ' (Resit)' : ''}</td><td>${gp}</td></tr>`
      }).join('')}
    </table>
    <div class="summary">
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px;">
        <div><strong>Total Credits:</strong> ${totalCredits}</div>
        <div><strong>GPA:</strong> <span style="font-size:24px; color:#115e59;">${gpa}</span></div>
        <div><strong>Classification:</strong> ${parseFloat(gpa) >= 4.5 ? 'First Class' : parseFloat(gpa) >= 3.5 ? 'Second Class Upper' : parseFloat(gpa) >= 2.5 ? 'Second Class Lower' : parseFloat(gpa) >= 1.5 ? 'Third Class' : 'Pass'}</div>
      </div>
    </div>
    <div class="footer">
      <p>This is a computer-generated document. Generated on ${TODAY} | ${settings.schoolName || 'University'}</p>
    </div>
    </body></html>
  `)
  printWindow.document.close()
  setTimeout(() => printWindow.print(), 500)
}

function printTranscript(student, allMarks, allCourses, settings) {
  const gpaMap = {}
  allMarks.forEach(m => {
    if (!gpaMap[m.semester]) gpaMap[m.semester] = []
    gpaMap[m.semester].push(m)
  })
  
  const printWindow = window.open('', '_blank')
  let semesterRows = ''
  let grandTotalCredits = 0, grandTotalPoints = 0
  
  Object.entries(gpaMap).forEach(([sem, marks]) => {
    let semCredits = 0, semPoints = 0
    marks.forEach(m => {
      const c = allCourses.find(x => x.id === m.courseId)
      const cr = c?.credits || 0
      semCredits += cr; semPoints += getGradePoint(m.grade) * cr
    })
    const semGpa = semCredits ? (semPoints / semCredits).toFixed(2) : '0.00'
    grandTotalCredits += semCredits; grandTotalPoints += semPoints
    
    semesterRows += `
      <h3 style="color:#115e59; margin-top:20px;">${sem}</h3>
      <table>
        <tr><th>Course Code</th><th>Course Name</th><th>Credits</th><th>Score</th><th>Grade</th></tr>
        ${marks.map(m => {
          const c = allCourses.find(x => x.id === m.courseId)
          return `<tr><td>${c?.code || '-'}</td><td>${c?.name || '-'}</td><td>${c?.credits || '-'}</td><td>${m.score}</td><td class="${m.grade === 'A' || m.grade === 'B' ? 'grade-a' : m.grade === 'F' ? 'grade-f' : 'grade-c'}">${m.grade}${m.resit ? ' (Resit)' : ''}</td></tr>`
        }).join('')}
        <tr style="background:#f0fdf4; font-weight:bold;"><td colspan="3">Semester GPA</td><td colspan="2">${semGpa}</td></tr>
      </table>
    `
  })
  
  const cgpa = grandTotalCredits ? (grandTotalPoints / grandTotalCredits).toFixed(2) : '0.00'
  
  printWindow.document.write(`
    <html><head><title>Academic Transcript - ${student.name}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
      .header { text-align: center; border-bottom: 3px solid #115e59; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { color: #115e59; margin: 0; }
      .header p { color: #666; margin: 5px 0 0; }
      .info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
      .info div { padding: 10px; background: #f8f9fa; border-radius: 5px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th { background: #115e59; color: white; padding: 12px; text-align: left; }
      td { padding: 10px 12px; border-bottom: 1px solid #eee; }
      .grade-a { color: #059669; font-weight: bold; } .grade-c { color: #d97706; font-weight: bold; } .grade-f { color: #dc2626; font-weight: bold; }
      .summary { background: #115e59; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px; }
      .summary span { font-size: 28px; font-weight: bold; }
      .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
      @media print { body { padding: 20px; } }
    </style></head><body>
    <div class="header">
      <h1>${settings.schoolName || 'University'}</h1>
      <p>${settings.motto || ''} | Academic Transcript</p>
    </div>
    <div class="info">
      <div><strong>Student Name:</strong> ${student.name}</div>
      <div><strong>Roll Number:</strong> ${student.roll}</div>
      <div><strong>Department:</strong> ${student.dept}</div>
      <div><strong>Level:</strong> ${student.level}</div>
    </div>
    ${semesterRows}
    <div class="summary">
      <p style="margin:0; opacity:0.8;">CUMULATIVE GPA</p>
      <span>${cgpa}</span>
      <p style="margin:5px 0 0; opacity:0.8;">Classification: ${parseFloat(cgpa) >= 4.5 ? 'First Class Honours' : parseFloat(cgpa) >= 3.5 ? 'Second Class Honours (Upper)' : parseFloat(cgpa) >= 2.5 ? 'Second Class Honours (Lower)' : parseFloat(cgpa) >= 1.5 ? 'Third Class' : 'Pass'}</p>
    </div>
    <div class="footer">
      <p>Official Transcript | Generated on ${TODAY} | ${settings.schoolName || 'University'}</p>
    </div>
    </body></html>
  `)
  printWindow.document.close()
  setTimeout(() => printWindow.print(), 500)
}

/* ==================== AUTH PAGES ==================== */
function LoginPage() {
  const [email, setEmail] = useState('admin@campus.edu')
  const [pw, setPw] = useState('admin123')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const settings = initDB().settings

  function onSubmit(e) {
    e.preventDefault(); setErr(''); setLoading(true)
    setTimeout(() => {
      const u = loginFn(email, pw)
      if (u) nav(u.role === 'superadmin' ? '/admin' : u.role === 'teacher' ? '/teacher' : '/student', { replace: true })
      else { setErr('Invalid email or password'); setLoading(false) }
    }, 400)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-[55%] bg-teal-900 relative overflow-hidden">
        <img src="https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 p-12 lg:p-16 text-white flex flex-col justify-center h-full">
          <div className="mb-10 inline-flex items-center gap-2 px-4 py-2 bg-amber-400/20 rounded-full border border-amber-400/30 w-fit">
            <span className="text-amber-400 font-bold text-sm tracking-wider">SCHOOL MANAGEMENT SYSTEM</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">{settings.schoolName || 'ACADEMIC'}<br />MANAGEMENT<br /><span className="text-amber-400">PLATFORM</span></h1>
          <p className="text-teal-100 text-lg max-w-md mb-10 opacity-80">Complete school management solution for students, teachers, and administrators.</p>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20"><p className="text-2xl font-bold text-emerald-400">120+</p><p className="text-xs text-white/60 mt-1">STUDENTS</p></div>
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20"><p className="text-2xl font-bold text-amber-400">15+</p><p className="text-xs text-white/60 mt-1">COURSES</p></div>
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20"><p className="text-2xl font-bold text-blue-400">98%</p><p className="text-xs text-white/60 mt-1">EFFICIENCY</p></div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-12 h-12 bg-teal-800 rounded-xl flex items-center justify-center shadow-lg"><span className="text-amber-400 text-xl font-black">S</span></div>
            <div><h2 className="text-lg font-black text-gray-900">{settings.schoolName || 'SCHOLAR'}</h2><p className="text-xs text-gray-500">{settings.motto || 'School Management System'}</p></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h3>
          <p className="text-gray-500 mb-8">Enter your credentials to access your portal</p>
          {err && <Alert type="error">{err}</Alert>}
          <form onSubmit={onSubmit} className="space-y-5">
            <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={pw} onChange={e => setPw(e.target.value)} required />
            <Button type="submit" variant="primary" className="w-full py-3 text-base" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </form>
          <div className="mt-6 p-4 bg-amber-50 rounded-xl text-sm border border-amber-200 space-y-1">
            <p className="font-semibold text-amber-800">Demo Credentials:</p>
            <p className="text-amber-700 text-xs">Admin: admin@campus.edu / admin123</p>
            <p className="text-amber-700 text-xs">Teacher: teacher.cs@campus.edu / 123456</p>
            <p className="text-amber-700 text-xs">Student: rahul@campus.edu / 123456</p>
          </div>
          <p className="text-center mt-6 text-gray-600 text-sm">New student? <Link to="/signup" className="font-bold text-teal-700 hover:text-teal-900 underline">Create Account</Link></p>
        </div>
      </div>
    </div>
  )
}

function SignupPage() {
  const [form, setForm] = useState({ matricule: '', name: '', email: '', pw: '', confirm: '', roll: '', dept: '', level: '', phone: '', gender: GENDERS[0] })
  const [admission, setAdmission] = useState(null)
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)
  const nav = useNavigate(); const settings = initDB().settings

  function verifyMatricule(value) {
    const d = initDB()
    const code = value.trim()
    const record = d.admittedStudents.find(a => a.matricule.toLowerCase() === code.toLowerCase())
    setAdmission(record || null)
    if (!code) return
    if (!record) {
      setErr('This matricule is not on the confirmed admitted-students list. Contact the school admin.')
      return
    }
    if (!record.confirmed) {
      setErr('This matricule has been generated but not confirmed by admin yet.')
      return
    }
    if (record.used) {
      setErr('This matricule has already been used to create an account.')
      return
    }
    setErr('')
    setForm(prev => ({ ...prev, matricule: record.matricule, name: record.name, roll: record.matricule, dept: record.dept, level: record.level }))
  }

  function onSubmit(e) {
    e.preventDefault(); setErr('')
    verifyMatricule(form.matricule)
    const d = initDB()
    const record = d.admittedStudents.find(a => a.matricule.toLowerCase() === form.matricule.trim().toLowerCase())
    if (!record || !record.confirmed || record.used) { setErr('Enter a valid, confirmed and unused matricule number.'); return }
    if (form.pw !== form.confirm) { setErr('Passwords do not match'); return }
    if (form.pw.length < 6) { setErr('Password must be at least 6 characters'); return }
    setLoading(true)
    setTimeout(() => {
      const res = signupFn({ ...form, confirm: undefined })
      if (res.success) nav('/student', { replace: true })
      else { setErr(res.msg); setLoading(false) }
    }, 400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-800 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-amber-400 text-2xl font-black">+</span></div>
          <h2 className="text-2xl font-bold text-gray-900">Student Registration</h2>
          <p className="text-gray-500 text-sm mt-2">Create your student account at {settings.schoolName}</p>
        </div>
        {err && <Alert type="error">{err}</Alert>}
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Matricule Number" value={form.matricule} onChange={e => { setForm({ ...form, matricule: e.target.value }); verifyMatricule(e.target.value) }} placeholder="Example: Uba23E0312" required />
          {admission && admission.confirmed && !admission.used && (
            <Alert type="success">
              Matricule verified for <strong>{admission.name}</strong> | {admission.faculty} | {admission.dept} | {admission.level}
            </Alert>
          )}
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Roll / Matricule" value={form.roll} onChange={e => setForm({ ...form, roll: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Department" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} required />
            <Input label="Level" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} required />
          </div>
          <Input label="Gender" options={GENDERS} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required />
          <Input label="Email Address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.pw} onChange={e => setForm({ ...form, pw: e.target.value })} required />
          <Input label="Confirm Password" type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
        </form>
        <p className="text-center mt-6 text-gray-600 text-sm">Already have an account? <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 underline">Sign In</Link></p>
      </Card>
    </div>
  )
}

/* ==================== SUPER ADMIN VIEWS ==================== */
function AdminDashboard() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    const d = initDB(); const sem = d.semesters.find(s => s.active) || d.semesters[0]
    setStats({
      teachers: d.users.filter(u => u.role === 'teacher').length,
      students: d.users.filter(u => u.role === 'student').length,
      courses: d.courses.length,
      revenue: d.fees.reduce((a, b) => a + b.paid, 0),
      unpaid: d.fees.filter(f => f.status !== 'Paid').length,
      unreadMsgs: d.messages.filter(m => m.toRole === 'superadmin' && !m.read).length,
      semester: sem?.name || 'N/A'
    })
  }, [])
  if (!stats) return <div className="p-10 text-center text-gray-500">Loading...</div>
  return (
    <div>
      <SectionTitle title="Super Admin Dashboard" subtitle={`Academic Year: ${initDB().settings.academicYear} | ${stats.semester}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Teachers" value={stats.teachers} color="blue" icon="👨‍🏫" />
        <StatCard title="Students" value={stats.students} color="teal" icon="👨‍🎓" />
        <StatCard title="Courses" value={stats.courses} color="purple" icon="📚" />
        <StatCard title="Messages" value={stats.unreadMsgs} color="amber" icon="" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Fee Revenue" value={'₦' + stats.revenue.toLocaleString()} color="green" icon="💰" />
        <StatCard title="Unpaid Fees" value={stats.unpaid} color="red" icon="⚠️" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLink to="/admin/teachers" icon="👨‍🏫" title="Teachers" desc="Create and manage teacher accounts" color="blue" />
        <QuickLink to="/admin/admissions" icon="🎓" title="Admissions & Matricules" desc="Upload admitted list and generate matricule numbers" color="amber" />
        <QuickLink to="/admin/students" icon="👨‍" title="Students" desc="View all students across departments" color="teal" />
        <QuickLink to="/admin/courses" icon="📚" title="Courses" desc="Add courses and assign teachers" color="purple" />
        <QuickLink to="/admin/semesters" icon="📅" title="Semesters" desc="Manage academic semesters" color="amber" />
        <QuickLink to="/admin/announcements" icon="📢" title="Announcements" desc="Post school-wide notices" color="slate" />
        <QuickLink to="/admin/messages" icon="" title="Messages" desc={`Student requests (${stats.unreadMsgs})`} color={stats.unreadMsgs > 0 ? 'red' : 'green'} />
        <QuickLink to="/admin/timetable" icon="" title="Timetable" desc="Manage class schedules" color="slate" />
        <QuickLink to="/admin/fees" icon="" title="Fees" desc="Track fee payments and deadlines" color="green" />
        <QuickLink to="/admin/reports" icon="📊" title="Reports" desc="Institution-wide reports" color="blue" />
        <QuickLink to="/admin/settings" icon="️" title="Settings" desc="School configuration" color="slate" />
      </div>
    </div>
  )
}

function AdminAdmissions() {
  const d0 = initDB()
  const [records, setRecords] = useState(d0.admittedStudents || [])
  const [faculty, setFaculty] = useState(FACULTIES[2].name)
  const [year, setYear] = useState('2023')
  const [level, setLevel] = useState('100 Level')
  const [startNo, setStartNo] = useState(1)
  const [namesText, setNamesText] = useState('')
  const [msg, setMsg] = useState('')

  function parseNames(text) {
    return text
      .split(/\r?\n/)
      .map(line => line.replace(/\s+/g, ' ').trim())
      .filter(line => line && !line.toLowerCase().includes('name') && line.length > 2)
      .map(line => line.split(',')[0].trim())
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = String(ev.target.result || '')
      const names = parseNames(text)
      if (names.length === 0) {
        setMsg('File loaded, but no names were detected. If this PDF is scanned or protected, copy the admitted names from the PDF and paste them below.')
      } else {
        setNamesText(names.join('\n'))
        setMsg(`${names.length} admitted student name(s) detected from ${file.name}. Review, then generate matricules.`)
      }
    }
    reader.readAsText(file)
  }

  function generateMatricules() {
    const names = parseNames(namesText)
    if (names.length === 0) { setMsg('Please upload a list or paste admitted student names first.'); return }
    const db = initDB()
    const fac = FACULTIES.find(f => f.name === faculty) || FACULTIES[0]
    const schoolCode = db.settings.schoolCode || 'Uba'
    const yy = String(year).slice(-2)
    const existing = db.admittedStudents || []
    const newRecords = names.map((name, index) => {
      const seq = Number(startNo) + index
      const matricule = `${schoolCode}${yy}${fac.code}${String(seq).padStart(4, '0')}`
      return {
        id: gid(), name, admissionYear: String(year), faculty: fac.name, facultyCode: fac.code,
        dept: fac.dept, level, sequence: seq, matricule, confirmed: false, used: false,
        source: 'Uploaded admitted list'
      }
    }).filter(r => !existing.find(x => x.matricule === r.matricule))
    db.admittedStudents = [...existing, ...newRecords]
    saveDB(db)
    setRecords(db.admittedStudents)
    setNamesText('')
    setMsg(`${newRecords.length} matricule number(s) generated. Review and confirm before students can use them.`)
  }

  function confirmRecord(id) {
    const db = initDB()
    db.admittedStudents = db.admittedStudents.map(r => r.id === id ? { ...r, confirmed: true } : r)
    saveDB(db); setRecords(db.admittedStudents)
  }

  function confirmAll() {
    const db = initDB()
    db.admittedStudents = db.admittedStudents.map(r => ({ ...r, confirmed: true }))
    saveDB(db); setRecords(db.admittedStudents); setMsg('All generated matricules have been confirmed.')
  }

  function removeRecord(id) {
    const db = initDB()
    db.admittedStudents = db.admittedStudents.filter(r => r.id !== id)
    saveDB(db); setRecords(db.admittedStudents)
  }

  function downloadCSV() {
    const header = 'Name,Matricule,Admission Year,Faculty,Department,Level,Status,Used\n'
    const rows = records.map(r => `"${r.name}",${r.matricule},${r.admissionYear},"${r.faculty}","${r.dept}","${r.level}",${r.confirmed ? 'Confirmed' : 'Pending'},${r.used ? 'Yes' : 'No'}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `matricule-list-${year}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  function printMatricules() {
    const db = initDB()
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Matricule List</title><style>body{font-family:Arial;padding:30px}h1{color:#115e59}table{width:100%;border-collapse:collapse}th{background:#115e59;color:white;padding:10px;text-align:left}td{border-bottom:1px solid #eee;padding:8px}.badge{font-weight:bold;color:#059669}</style></head><body><h1>${db.settings.schoolName} - Admitted Students Matricule List</h1><p>Academic Year: ${db.settings.academicYear}</p><table><tr><th>#</th><th>Name</th><th>Matricule</th><th>Faculty</th><th>Department</th><th>Status</th></tr>${records.map((r,i)=>`<tr><td>${i+1}</td><td>${r.name}</td><td><strong>${r.matricule}</strong></td><td>${r.faculty}</td><td>${r.dept}</td><td class="badge">${r.confirmed?'Confirmed':'Pending'}</td></tr>`).join('')}</table></body></html>`)
    win.document.close(); setTimeout(() => win.print(), 400)
  }

  return (
    <div>
      <SectionTitle title="Admissions & Matricule Generation" subtitle="Upload admitted students, generate official matricule numbers, then confirm them for student signup." action={<div className="flex gap-2"><Button variant="outline" onClick={downloadCSV}>Download CSV</Button><Button variant="outline" onClick={printMatricules}>Print / PDF</Button></div>} />
      {msg && <Alert type={msg.includes('generated') || msg.includes('confirmed') || msg.includes('detected') ? 'success' : 'warning'} onClose={() => setMsg('')}>{msg}</Alert>}
      <Card className="p-6 mb-6">
        <div className="grid lg:grid-cols-4 gap-4 mb-4">
          <Input label="Admission Year" value={year} onChange={e => setYear(e.target.value)} placeholder="2023" required />
          <Input label="Faculty" options={FACULTIES.map(f => f.name)} value={faculty} onChange={e => setFaculty(e.target.value)} required />
          <Input label="Student Level" options={LEVELS} value={level} onChange={e => setLevel(e.target.value)} required />
          <Input label="Starting Student Number" type="number" value={startNo} onChange={e => setStartNo(e.target.value)} required />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload admitted list (.pdf, .txt, .csv)</label>
            <input type="file" accept=".pdf,.txt,.csv" onChange={handleFile} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white" />
            <p className="text-xs text-gray-500 mt-2">For scanned PDFs, paste the names manually in the box on the right after uploading.</p>
          </div>
          <Input label="Admitted Student Names" rows={6} value={namesText} onChange={e => setNamesText(e.target.value)} placeholder={'Paste one student name per line\nExample:\nGrace Nchang\nPeter Atanga'} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="primary" onClick={generateMatricules}>Generate Matricule Numbers</Button>
          <Button variant="accent" onClick={confirmAll} disabled={records.length === 0}>Confirm All</Button>
        </div>
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          Format example: <strong>Uba23E0312</strong>. <strong>{initDB().settings.schoolCode}</strong> = school code, <strong>{String(year).slice(-2)}</strong> = admission year, <strong>{FACULTIES.find(f => f.name === faculty)?.code}</strong> = faculty code, last four digits = student number.
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Matricule</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Faculty / Dept</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No admitted students uploaded yet.</td></tr> : records.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{r.name}<div className="text-xs text-gray-400">Admitted {r.admissionYear} | {r.level}</div></td>
                <td className="px-4 py-3 font-bold text-teal-700">{r.matricule}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.faculty}<br />{r.dept}</td>
                <td className="px-4 py-3"><Badge st={r.used ? 'Used' : r.confirmed ? 'Confirmed' : 'Pending'} type={r.used ? 'payment' : 'status'} /></td>
                <td className="px-4 py-3 flex gap-2">
                  {!r.confirmed && <Button variant="accent" onClick={() => confirmRecord(r.id)} className="text-xs py-1 px-2">Confirm</Button>}
                  {!r.used && <Button variant="danger" onClick={() => removeRecord(r.id)} className="text-xs py-1 px-2">Delete</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function AdminTeachers() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', email: '', pw: '123456', dept: DEPTS[0], level: LEVELS[0], phone: '', gender: GENDERS[0] })
  const [msg, setMsg] = useState(''); const [tab, setTab] = useState('list')

  useEffect(() => { setList(initDB().users.filter(u => u.role === 'teacher')) }, [])

  function submit(e) {
    e.preventDefault()
    const d = initDB()
    if (d.users.find(u => u.email === form.email)) { setMsg('Email exists!'); return }
    d.users.push({ ...form, id: gid(), role: 'teacher', photo: null })
    saveDB(d); setForm({ name: '', email: '', pw: '123456', dept: DEPTS[0], level: LEVELS[0], phone: '', gender: GENDERS[0] })
    setList(d.users.filter(u => u.role === 'teacher')); setMsg('Teacher created!'); setTab('list')
  }

  function del(id) {
    if (window.confirm('Delete teacher?')) {
      const d = initDB(); d.users = d.users.filter(u => u.id !== id)
      d.courses.forEach(c => { if (c.teacherId === id) c.teacherId = null })
      saveDB(d); setList(d.users.filter(u => u.role === 'teacher'))
    }
  }

  return (
    <div>
      <SectionTitle title="Manage Teachers" subtitle="Create and manage teacher accounts" action={<TabBar tabs={[{ id: 'list', label: 'All Teachers' }, { id: 'add', label: 'Add Teacher' }]} active={tab} onChange={setTab} />} />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      {tab === 'add' && (
        <Card className="p-6 mb-6 max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Department" options={DEPTS} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} required />
              <Input label="Level" options={LEVELS} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Gender" options={GENDERS} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required />
              <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <p className="text-xs text-gray-500">Default password: 123456</p>
            <Button type="submit" variant="primary">Create Teacher</Button>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Department</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Level</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{t.name}</td>
                <td className="px-4 py-3 text-gray-600">{t.email}</td>
                <td className="px-4 py-3 text-gray-500">{t.dept}</td>
                <td className="px-4 py-3 text-gray-500">{t.level}</td>
                <td className="px-4 py-3"><Button variant="danger" onClick={() => del(t.id)} className="text-xs py-1 px-2">Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function AdminStudents() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState({ dept: '', level: '', search: '' })

  useEffect(() => { loadStudents() }, [filter])
  function loadStudents() {
    const d = initDB(); let studs = d.users.filter(u => u.role === 'student')
    if (filter.dept) studs = studs.filter(s => s.dept === filter.dept)
    if (filter.level) studs = studs.filter(s => s.level === filter.level)
    if (filter.search) studs = studs.filter(s => s.name.toLowerCase().includes(filter.search.toLowerCase()) || s.roll.toLowerCase().includes(filter.search.toLowerCase()))
    setList(studs)
  }
  function del(id) {
    if (window.confirm('Delete student?')) {
      const d = initDB(); d.users = d.users.filter(u => u.id !== id)
      d.attendance = d.attendance.filter(a => a.userId !== id); d.enrollments = d.enrollments.filter(e => e.userId !== id)
      d.marks = d.marks.filter(m => m.userId !== id); d.fees = d.fees.filter(f => f.userId !== id)
      saveDB(d); loadStudents()
    }
  }

  return (
    <div>
      <SectionTitle title="All Students" subtitle="View and manage students across all departments" />
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Search" value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} placeholder="Name or roll number..." />
          <Input label="Department" options={['', ...DEPTS]} value={filter.dept} onChange={e => setFilter({ ...filter, dept: e.target.value })} />
          <Input label="Level" options={['', ...LEVELS]} value={filter.level} onChange={e => setFilter({ ...filter, level: e.target.value })} />
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll No</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Dept</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Level</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.roll}</td>
                <td className="px-4 py-3 text-gray-500">{s.dept}</td>
                <td className="px-4 py-3 text-gray-500">{s.level}</td>
                <td className="px-4 py-3"><Button variant="danger" onClick={() => del(s.id)} className="text-xs py-1 px-2">Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function AdminCourses() {
  const [list, setList] = useState([]); const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({ code: '', name: '', credits: 3, dept: DEPTS[0], level: LEVELS[0], teacherId: '', semester: 'First Semester', resit: false })
  const [msg, setMsg] = useState(''); const [tab, setTab] = useState('list')

  useEffect(() => { const d = initDB(); setList(d.courses); setTeachers(d.users.filter(u => u.role === 'teacher')) }, [])

  function submit(e) {
    e.preventDefault(); const d = initDB(); d.courses.push({ ...form, id: gid() }); saveDB(d)
    setForm({ code: '', name: '', credits: 3, dept: DEPTS[0], level: LEVELS[0], teacherId: '', semester: 'First Semester', resit: false })
    setList(d.courses); setMsg('Course added!'); setTab('list')
  }
  function del(id) {
    if (window.confirm('Delete course?')) {
      const d = initDB(); d.courses = d.courses.filter(c => c.id !== id)
      d.enrollments = d.enrollments.filter(e => e.courseId !== id); d.marks = d.marks.filter(m => m.courseId !== id)
      d.timetable = d.timetable.filter(t => t.courseId !== id); saveDB(d); setList(d.courses)
    }
  }

  return (
    <div>
      <SectionTitle title="Manage Courses" subtitle="Add courses and assign teachers" action={<TabBar tabs={[{ id: 'list', label: 'All Courses' }, { id: 'add', label: 'Add Course' }]} active={tab} onChange={setTab} />} />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      {tab === 'add' && (
        <Card className="p-6 mb-6 max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Course Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS301" required />
            <Input label="Course Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input type="number" label="Credits" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} required />
              <Input label="Semester" options={TERMS} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} required />
              <Input label="Resit Course" options={['No', 'Yes']} value={form.resit ? 'Yes' : 'No'} onChange={e => setForm({ ...form, resit: e.target.value === 'Yes' })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Department" options={DEPTS} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} required />
              <Input label="Level" options={LEVELS} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} required />
            </div>
            <Input label="Assign Teacher" options={[{ value: '', label: 'Select Teacher...' }, ...teachers.map(t => ({ value: t.id, label: `${t.name} (${t.dept})` }))]} value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })} />
            <Button type="submit" variant="primary">Add Course</Button>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Code</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Credits</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Dept/Level</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Teacher</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Semester</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(c => {
              const t = teachers.find(x => x.id === c.teacherId)
              return (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-teal-700">{c.code}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{c.name}{c.resit && <span className="text-xs text-red-600 ml-2">(Resit)</span>}</td>
                  <td className="px-4 py-3 text-gray-600">{c.credits}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.dept}<br/>{c.level}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{t ? t.name : 'Unassigned'}</td>
                  <td className="px-4 py-3"><Badge st={c.semester} type="semester" /></td>
                  <td className="px-4 py-3"><Button variant="danger" onClick={() => del(c.id)} className="text-xs py-1 px-2">Delete</Button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function AdminSemesters() {
  const [list, setList] = useState([]); const [form, setForm] = useState({ name: '', year: '', startDate: '', endDate: '', active: false })
  const [msg, setMsg] = useState(''); const [tab, setTab] = useState('list')

  useEffect(() => { setList(initDB().semesters) }, [])

  function submit(e) {
    e.preventDefault(); const d = initDB()
    if (form.active) d.semesters.forEach(s => s.active = false)
    d.semesters.push({ ...form, id: gid() }); saveDB(d)
    setList(d.semesters); setForm({ name: '', year: '', startDate: '', endDate: '', active: false }); setTab('list'); setMsg('Semester added!')
  }
  function setActive(id) {
    const d = initDB(); d.semesters.forEach(s => s.active = s.id === id); saveDB(d); setList(d.semesters)
  }
  function del(id) { const d = initDB(); d.semesters = d.semesters.filter(s => s.id !== id); saveDB(d); setList(d.semesters) }

  return (
    <div>
      <SectionTitle title="Manage Semesters" subtitle="Set academic semesters and active term" action={<TabBar tabs={[{ id: 'list', label: 'Semesters' }, { id: 'add', label: 'Add Semester' }]} active={tab} onChange={setTab} />} />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      {tab === 'add' && (
        <Card className="p-6 mb-6 max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Semester Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="First Semester" required />
            <Input label="Academic Year" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2025/2026" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input type="date" label="Start Date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
              <Input type="date" label="End Date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
              <label className="text-sm font-medium">Set as active semester</label>
            </div>
            <Button type="submit" variant="primary">Add Semester</Button>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Year</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Period</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.year}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.startDate)} - {formatDate(s.endDate)}</td>
                <td className="px-4 py-3">{s.active ? <Badge st="Active" /> : <Badge st="Inactive" />}</td>
                <td className="px-4 py-3 flex gap-2">
                  {!s.active && <Button variant="accent" onClick={() => setActive(s.id)} className="text-xs py-1 px-2">Set Active</Button>}
                  <Button variant="danger" onClick={() => del(s.id)} className="text-xs py-1 px-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function AdminDeadlines() {
  const [settings, setSettings] = useState(null); const [msg, setMsg] = useState('')
  useEffect(() => { setSettings(initDB().settings) }, [])
  if (!settings) return <div className="p-10 text-center text-gray-500">Loading...</div>

  function save(key, value) {
    const d = initDB(); d.settings[key] = value; saveDB(d); setSettings(d.settings); setMsg('Deadline updated!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div>
      <SectionTitle title="Academic Deadlines" subtitle="Set important dates for the semester" />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Fee Payment Deadline</h3>
          <p className="text-sm text-gray-500 mb-4">Last date for students to pay fees</p>
          <input type="date" value={settings.feeDeadline} onChange={e => save('feeDeadline', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <p className="text-xs text-gray-400 mt-2">Current: {formatDate(settings.feeDeadline)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Course Registration Deadline</h3>
          <p className="text-sm text-gray-500 mb-4">Last date for course registration</p>
          <input type="date" value={settings.regDeadline} onChange={e => save('regDeadline', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <p className="text-xs text-gray-400 mt-2">Current: {formatDate(settings.regDeadline)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Resit Exam Deadline</h3>
          <p className="text-sm text-gray-500 mb-4">Last date for resit registrations</p>
          <input type="date" value={settings.resitDeadline} onChange={e => save('resitDeadline', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <p className="text-xs text-gray-400 mt-2">Current: {formatDate(settings.resitDeadline)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Exam Start Date</h3>
          <p className="text-sm text-gray-500 mb-4">First day of examinations</p>
          <input type="date" value={settings.examStartDate} onChange={e => save('examStartDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Exam End Date</h3>
          <p className="text-sm text-gray-500 mb-4">Last day of examinations</p>
          <input type="date" value={settings.examEndDate} onChange={e => save('examEndDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Academic Year</h3>
          <p className="text-sm text-gray-500 mb-4">Current academic year</p>
          <input type="text" value={settings.academicYear} onChange={e => save('academicYear', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="2025/2026" />
        </Card>
      </div>
    </div>
  )
}

function AdminMessages() {
  const [list, setList] = useState([]); const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState(''); const [msg, setMsg] = useState('')

  useEffect(() => {
    const d = initDB()
    setList(d.messages.filter(m => m.toRole === 'superadmin' || m.fromRole === 'superadmin').sort((a, b) => b.date.localeCompare(a.date)))
  }, [])

  function sendReply() {
    if (!reply.trim() || !selected) return
    const d = initDB()
    d.messages.push({ id: gid(), fromId: getUser().id, fromRole: 'superadmin', toId: selected.fromId, toRole: 'student', subject: selected.subject, body: reply, date: TODAY, read: false })
    saveDB(d); setReply(''); setMsg('Reply sent!')
    const updated = d.messages.filter(m => m.toRole === 'superadmin' || m.fromRole === 'superadmin').sort((a, b) => b.date.localeCompare(a.date))
    setList(updated)
    setTimeout(() => setMsg(''), 3000)
  }

  function selectMsg(m) {
    setSelected(m)
    const d = initDB()
    const idx = d.messages.findIndex(x => x.id === m.id)
    if (idx >= 0 && !d.messages[idx].read) { d.messages[idx].read = true; saveDB(d) }
  }

  return (
    <div>
      <SectionTitle title="Student Messages" subtitle="Respond to student requests and issues" />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 overflow-hidden" style={{ maxHeight: 600 }}>
          <div className="p-4 border-b border-gray-100 font-bold text-gray-900">Inbox</div>
          <div className="overflow-y-auto" style={{ maxHeight: 540 }}>
            {list.map(m => (
              <div key={m.id} onClick={() => selectMsg(m)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selected?.id === m.id ? 'bg-teal-50' : ''} ${!m.read ? 'border-l-4 border-l-amber-400' : ''}`}>
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm text-gray-900">{m.subject}</p>
                  {!m.read && <span className="w-2 h-2 bg-amber-400 rounded-full"></span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">From: {m.fromId ? getUser().id === m.fromId ? 'Admin' : 'Student' : 'Student'}</p>
                <p className="text-xs text-gray-400">{m.date}</p>
              </div>
            ))}
            {list.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No messages</div>}
          </div>
        </Card>
        <Card className="lg:col-span-2 p-6">
          {selected ? (
            <div>
              <h3 className="font-bold text-lg text-gray-900">{selected.subject}</h3>
              <p className="text-sm text-gray-500 mt-1">From Student on {selected.date}</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-700 text-sm">{selected.body}</div>
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Reply</h4>
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Type your response..." />
                <Button variant="primary" onClick={sendReply} className="mt-3" disabled={!reply.trim()}>Send Reply</Button>
              </div>
            </div>
          ) : (
            <EmptyState icon="💬" title="No message selected" subtitle="Select a message from the inbox to read and reply" />
          )}
        </Card>
      </div>
    </div>
  )
}

function AdminAnnouncements() {
  const [list, setList] = useState([]); const [form, setForm] = useState({ title: '', body: '', target: 'all' })
  const [msg, setMsg] = useState(''); const [tab, setTab] = useState('list')

  useEffect(() => { setList(initDB().announcements.sort((a, b) => b.date.localeCompare(a.date))) }, [])

  function submit(e) {
    e.preventDefault(); const d = initDB()
    d.announcements.push({ ...form, id: gid(), date: TODAY, readBy: [] }); saveDB(d)
    setForm({ title: '', body: '', target: 'all' }); setList(d.announcements.sort((a, b) => b.date.localeCompare(a.date))); setMsg('Posted!'); setTab('list')
  }
  function del(id) { const d = initDB(); d.announcements = d.announcements.filter(a => a.id !== id); saveDB(d); setList(d.announcements) }

  return (
    <div>
      <SectionTitle title="Announcements" subtitle="Post school-wide notices" action={<TabBar tabs={[{ id: 'list', label: 'All Posts' }, { id: 'add', label: 'New Post' }]} active={tab} onChange={setTab} />} />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      {tab === 'add' && (
        <Card className="p-6 mb-6 max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <Input label="Announcement" rows={5} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required />
            <Input label="Target Audience" options={['all', 'students', 'teachers']} value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} required />
            <Button type="submit" variant="primary">Post Announcement</Button>
          </form>
        </Card>
      )}
      <div className="space-y-4">
        {list.map(a => (
          <Card key={a.id} className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900">{a.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{a.body}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs text-gray-400">{a.date}</span>
                  <Badge st={a.target === 'all' ? 'Everyone' : a.target} type="status" />
                </div>
              </div>
              <Button variant="danger" onClick={() => del(a.id)} className="text-xs py-1 px-2 shrink-0">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AdminTimetable() {
  const [list, setList] = useState([]); const [courses, setCourses] = useState([])
  const [form, setForm] = useState({ courseId: '', day: 'Monday', startTime: '09:00', endTime: '10:00', venue: '' })
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  useEffect(() => { const d = initDB(); setList(d.timetable); setCourses(d.courses) }, [])

  function submit(e) {
    e.preventDefault(); const d = initDB(); d.timetable.push({ ...form, id: gid() }); saveDB(d); setForm({ courseId: '', day: 'Monday', startTime: '09:00', endTime: '10:00', venue: '' }); setList(d.timetable)
  }
  function del(id) { const d = initDB(); d.timetable = d.timetable.filter(t => t.id !== id); saveDB(d); setList(d.timetable) }

  return (
    <div>
      <SectionTitle title="Class Timetable" subtitle="Manage weekly schedules" />
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Add Schedule</h3>
          <form onSubmit={submit} className="space-y-3">
            <Input options={[{ value: '', label: 'Select Course...' }, ...courses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))]} value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} required />
            <Input options={days} value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
              <Input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required />
            </div>
            <Input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Venue" required />
            <Button type="submit" variant="primary" className="w-full">Add Schedule</Button>
          </form>
        </Card>
        <Card className="lg:col-span-3 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map(day => {
              const items = list.filter(t => t.day === day)
              return (
                <div key={day} className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-bold text-teal-800 mb-3 text-sm">{day}</h4>
                  <div className="space-y-2">
                    {items.map(t => {
                      const c = courses.find(x => x.id === t.courseId)
                      return (
                        <div key={t.id} className="p-2 bg-white rounded border border-gray-100 text-xs">
                          <p className="font-semibold text-gray-900">{c?.code}</p>
                          <p className="text-gray-500">{t.startTime}-{t.endTime}</p>
                          <p className="text-gray-400">{t.venue}</p>
                          <button onClick={() => del(t.id)} className="text-red-500 mt-1">✕</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function AdminFees() {
  const [students, setStudents] = useState([]); const [fees, setFees] = useState([])
  const [form, setForm] = useState({ userId: '', amount: '', paid: '', semester: 'First Semester' })
  const [msg, setMsg] = useState('')

  useEffect(() => { const d = initDB(); setStudents(d.users.filter(u => u.role === 'student')); setFees(d.fees) }, [])

  function submit(e) {
    e.preventDefault(); const d = initDB()
    const amount = parseFloat(form.amount); const paid = parseFloat(form.paid)
    const status = paid >= amount ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid'
    const existing = d.fees.find(f => f.userId === form.userId && f.semester === form.semester)
    if (existing) { existing.amount = amount; existing.paid = paid; existing.status = status; existing.date = TODAY }
    else { d.fees.push({ id: gid(), userId: form.userId, amount, paid, semester: form.semester, date: TODAY, status }) }
    saveDB(d); setFees(d.fees); setForm({ userId: '', amount: '', paid: '', semester: 'First Semester' }); setMsg('Saved!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div>
      <SectionTitle title="Fee Management" subtitle="Track payments and deadlines" />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
        <p className="text-sm text-amber-800 font-semibold">Fee Deadline: {formatDate(initDB().settings.feeDeadline)} {isDeadlinePassed(initDB().settings.feeDeadline) && '⚠️ PASSED'}</p>
      </Card>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Record Payment</h3>
          <form onSubmit={submit} className="space-y-3">
            <Input options={[{ value: '', label: 'Select Student...' }, ...students.map(s => ({ value: s.id, label: `${s.name} (${s.roll})` }))]} value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required />
            <Input options={TERMS} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} required />
            <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Total Amount" required />
            <Input type="number" value={form.paid} onChange={e => setForm({ ...form, paid: e.target.value })} placeholder="Amount Paid" required />
            <Button type="submit" variant="primary" className="w-full">Save Record</Button>
          </form>
        </Card>
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Semester</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Paid</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Balance</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map(f => {
                const s = students.find(x => x.id === f.userId)
                return (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{s?.name || '?'}</td>
                    <td className="px-4 py-3 text-gray-600">{f.semester}</td>
                    <td className="px-4 py-3 text-gray-600">₦{f.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">₦{f.paid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">₦{(f.amount - f.paid).toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge st={f.status} type="payment" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function AdminReports() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const d = initDB(); const studs = d.users.filter(u => u.role === 'student')
    const reports = studs.map(s => {
      const myMarks = d.marks.filter(m => m.userId === s.id)
      const totalCr = myMarks.reduce((a, m) => a + (d.courses.find(c => c.id === m.courseId)?.credits || 0), 0)
      const totalPts = myMarks.reduce((a, m) => a + (getGradePoint(m.grade) * (d.courses.find(c => c.id === m.courseId)?.credits || 0)), 0)
      const gpa = totalCr ? (totalPts / totalCr).toFixed(2) : '0.00'
      const myFee = d.fees.find(f => f.userId === s.id)
      const att = d.attendance.filter(a => a.userId === s.id)
      const attRate = att.length ? Math.round(att.filter(a => a.status === 'Present').length / att.length * 100) : 0
      return { ...s, gpa, courses: d.enrollments.filter(e => e.userId === s.id).length, feeStatus: myFee?.status || 'N/A', attRate, failed: myMarks.filter(m => m.grade === 'F').length }
    })
    setData(reports)
  }, [])
  if (!data) return <div className="p-10 text-center text-gray-500">Loading...</div>

  return (
    <div>
      <SectionTitle title="Institution Reports" subtitle="Comprehensive student performance overview" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Dept</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">GPA</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Att%</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Failed</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fee</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.roll}</td>
                <td className="px-4 py-3 text-gray-500">{s.dept}</td>
                <td className="px-4 py-3 font-bold text-teal-700">{s.gpa}</td>
                <td className="px-4 py-3">{s.attRate}%</td>
                <td className="px-4 py-3 text-red-600">{s.failed}</td>
                <td className="px-4 py-3"><Badge st={s.feeStatus} type="payment" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function AdminSettings() {
  const [settings, setSettings] = useState(null); const [msg, setMsg] = useState('')
  useEffect(() => { setSettings(initDB().settings) }, [])
  if (!settings) return <div className="p-10 text-center text-gray-500">Loading...</div>

  function save(key, value) {
    const d = initDB(); d.settings[key] = value; saveDB(d); setSettings(d.settings)
  }
  function saveAll(e) {
    e.preventDefault(); const d = initDB()
    d.settings.schoolName = settings.schoolName; d.settings.motto = settings.motto
    saveDB(d); setMsg('Settings saved!'); setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div>
      <SectionTitle title="System Settings" subtitle="Configure school information" />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">School Information</h3>
          <form onSubmit={saveAll} className="space-y-4">
            <Input label="School Name" value={settings.schoolName} onChange={e => setSettings({ ...settings, schoolName: e.target.value })} required />
            <Input label="Motto" value={settings.motto} onChange={e => setSettings({ ...settings, motto: e.target.value })} />
            <Button type="submit" variant="primary">Save Changes</Button>
          </form>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Deadlines</h3>
          <div className="space-y-3">
            <Input type="date" label="Fee Deadline" value={settings.feeDeadline} onChange={e => save('feeDeadline', e.target.value)} />
            <Input type="date" label="Registration Deadline" value={settings.regDeadline} onChange={e => save('regDeadline', e.target.value)} />
            <Input type="date" label="Resit Deadline" value={settings.resitDeadline} onChange={e => save('resitDeadline', e.target.value)} />
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ==================== TEACHER VIEWS ==================== */
function TeacherDashboard() {
  const user = getUser(); const [stats, setStats] = useState(null)
  useEffect(() => {
    const d = initDB()
    setStats({ students: d.users.filter(u => u.role === 'student' && u.dept === user.dept).length, courses: d.courses.filter(c => c.teacherId === user.id).length })
  }, [user])
  if (!stats) return <div className="p-10 text-center text-gray-500">Loading...</div>
  return (
    <div>
      <SectionTitle title={`Welcome, ${user.name}`} subtitle={`${user.dept} Department | ${user.level}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard title="Students in Department" value={stats.students} color="teal" icon="👨‍🎓" />
        <StatCard title="Assigned Courses" value={stats.courses} color="blue" icon="📚" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink to="/teacher/students" icon="👨‍🎓" title="My Students" desc="View students in your department" color="teal" />
        <QuickLink to="/teacher/attendance" icon="📅" title="Attendance" desc="Mark daily attendance" color="green" />
        <QuickLink to="/teacher/marks" icon="📝" title="Upload Marks" desc="Input scores for your courses" color="amber" />
      </div>
    </div>
  )
}

function TeacherStudents() {
  const user = getUser(); const [list, setList] = useState([])
  useEffect(() => { setList(initDB().users.filter(u => u.role === 'student' && u.dept === user.dept)) }, [user])
  return (
    <div>
      <SectionTitle title="My Students" subtitle={`Students in ${user.dept} department`} />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll No</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Level</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {list.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No students in this department.</td></tr> : list.map(s => (
              <tr key={s.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td><td className="px-4 py-3 text-gray-600">{s.roll}</td><td className="px-4 py-3 text-gray-500">{s.level}</td><td className="px-4 py-3 text-gray-500">{s.email}</td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function TeacherAttendance() {
  const user = getUser(); const [date, setDate] = useState(TODAY); const [stud, setStud] = useState([]); const [map, setMap] = useState({})
  function load() {
    const d = initDB(); const myStudents = d.users.filter(u => u.role === 'student' && u.dept === user.dept); setStud(myStudents)
    const m = {}; d.attendance.filter(a => a.date === date && myStudents.find(s => s.id === a.userId)).forEach(a => { m[a.userId] = a }); setMap(m)
  }
  useEffect(() => { load() }, [date, user])
  function mark(uid, st) {
    const d = initDB(); const now = new Date(); const t = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
    const idx = d.attendance.findIndex(a => a.userId === uid && a.date === date)
    if (idx >= 0) { d.attendance[idx].status = st; d.attendance[idx].time = t } else { d.attendance.push({ id: gid(), userId: uid, date, status: st, time: t }) }
    saveDB(d); load()
  }
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <SectionTitle title="Mark Attendance" subtitle={`${user.dept} department`} />
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll No</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {stud.map(s => {
              const r = map[s.id]
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.roll}</td>
                  <td className="px-4 py-3">{r ? <Badge st={r.status} /> : <span className="text-gray-400 text-xs">Pending</span>}</td>
                  <td className="px-4 py-3 flex gap-2">
                    {['Present', 'Absent', 'Late'].map(st => (
                      <button key={st} onClick={() => mark(s.id, st)} className={`px-3 py-1 rounded text-xs font-bold ${r?.status === st ? 'bg-teal-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{st}</button>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function TeacherMarks() {
  const user = getUser(); const [courses, setCourses] = useState([]); const [selCourse, setSelCourse] = useState('')
  const [students, setStudents] = useState([]); const [scores, setScores] = useState({}); const [msg, setMsg] = useState('')
  useEffect(() => { setCourses(initDB().courses.filter(c => c.teacherId === user.id)) }, [user])
  useEffect(() => {
    if (!selCourse) return
    const d = initDB(); const enrolledIds = d.enrollments.filter(e => e.courseId === selCourse).map(e => e.userId)
    const studs = d.users.filter(u => enrolledIds.includes(u.id) && u.dept === user.dept); setStudents(studs)
    const init = {}; studs.forEach(s => { const m = d.marks.find(x => x.userId === s.id && x.courseId === selCourse); init[s.id] = m ? m.score : '' }); setScores(init); setMsg('')
  }, [selCourse, user])
  function saveMarks() {
    const d = initDB()
    students.forEach(s => {
      const score = parseInt(scores[s.id])
      if (!isNaN(score)) {
        const idx = d.marks.findIndex(m => m.userId === s.id && m.courseId === selCourse)
        const entry = { userId: s.id, courseId: selCourse, score, grade: getGrade(score), semester: initDB().settings.currentSemester, resit: false }
        if (idx >= 0) d.marks[idx] = entry; else d.marks.push(entry)
      }
    }); saveDB(d); setMsg('Marks saved!'); setTimeout(() => setMsg(''), 3000)
  }
  return (
    <div>
      <SectionTitle title="Upload Marks" subtitle="Input scores for your assigned courses" />
      <Card className="p-6 mb-6">
        <Input label="Select Course" options={[{ value: '', label: 'Choose a Course...' }, ...courses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))]} value={selCourse} onChange={e => setSelCourse(e.target.value)} />
      </Card>
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      {selCourse && students.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll No</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Score</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Grade</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.roll}</td>
                  <td className="px-4 py-3"><input type="number" min="0" max="100" value={scores[s.id] || ''} onChange={e => setScores({ ...scores, [s.id]: e.target.value })} className="w-24 px-3 py-1 border border-gray-300 rounded text-sm" /></td>
                  <td className="px-4 py-3">{scores[s.id] !== '' && !isNaN(scores[s.id]) && <Badge st={getGrade(parseInt(scores[s.id]))} type="grade" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <Button variant="primary" onClick={saveMarks}>Save Marks</Button>
          </div>
        </Card>
      )}
      {selCourse && students.length === 0 && <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-xl text-center">No students from your department are registered for this course.</div>}
    </div>
  )
}

function TeacherTimetable() {
  const user = getUser(); const [list, setList] = useState([]); const [courses, setCourses] = useState([])
  useEffect(() => { const d = initDB(); const myCourseIds = d.courses.filter(c => c.teacherId === user.id).map(c => c.id); setList(d.timetable.filter(t => myCourseIds.includes(t.courseId))); setCourses(d.courses) }, [user])
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  return (
    <div>
      <SectionTitle title="My Timetable" subtitle="Your weekly class schedule" />
      <div className="space-y-4">
        {days.map(day => {
          const dayItems = list.filter(t => t.day === day)
          if (dayItems.length === 0) return null
          return (
            <Card key={day} className="p-4">
              <h4 className="font-bold text-teal-800 mb-3">{day}</h4>
              <div className="space-y-2">
                {dayItems.map(t => { const c = courses.find(x => x.id === t.courseId); return (
                  <div key={t.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100"><p className="font-semibold text-gray-900">{c?.code} - {c?.name}</p><p className="text-sm text-gray-500">{t.startTime} - {t.endTime} | {t.venue}</p></div>
                )})}
              </div>
            </Card>
          )
        })}
        {list.length === 0 && <EmptyState icon="🕐" title="No timetable" subtitle="No schedule entries for your courses" />}
      </div>
    </div>
  )
}

/* ==================== STUDENT VIEWS ==================== */
function StudentDashboard() {
  const user = getUser(); const [stats, setStats] = useState(null); const [announcements, setAnnouncements] = useState([])
  useEffect(() => {
    const d = initDB()
    const myMarks = d.marks.filter(m => m.userId === user.id)
    const totalCr = myMarks.reduce((a, m) => a + (d.courses.find(c => c.id === m.courseId)?.credits || 0), 0)
    const totalPts = myMarks.reduce((a, m) => a + (getGradePoint(m.grade) * (d.courses.find(c => c.id === m.courseId)?.credits || 0)), 0)
    const gpa = totalCr ? (totalPts / totalCr).toFixed(2) : '0.00'
    const myAtt = d.attendance.filter(a => a.userId === user.id && a.date === TODAY)
    const totalFees = d.fees.filter(f => f.userId === user.id).reduce((a, b) => a + b.amount, 0)
    const paidFees = d.fees.filter(f => f.userId === user.id).reduce((a, b) => a + b.paid, 0)
    const failedCourses = myMarks.filter(m => m.grade === 'F')
    setStats({ courses: d.enrollments.filter(e => e.userId === user.id).length, gpa, status: myAtt[0]?.status || 'Not Marked', balance: totalFees - paidFees, failed: failedCourses.length })
    setAnnouncements(d.announcements.filter(a => a.target === 'all' || a.target === 'students').slice(0, 3))
  }, [user])
  if (!stats) return <div className="p-10 text-center text-gray-500">Loading...</div>
  const settings = initDB().settings

  return (
    <div>
      <SectionTitle title={`Welcome, ${user.name}`} subtitle={`${user.roll} | ${user.dept} | ${user.level}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Courses" value={stats.courses} color="blue" icon="📚" />
        <StatCard title="GPA" value={stats.gpa} color="teal" icon="" />
        <StatCard title="Attendance" value={stats.status} color={stats.status === 'Present' ? 'green' : 'red'} icon="📅" />
        <StatCard title="Fee Balance" value={'₦' + stats.balance.toLocaleString()} color={stats.balance > 0 ? 'red' : 'green'} icon="" />
      </div>
      {stats.failed > 0 && (
        <Alert type="warning">You have {stats.failed} failed course(s) requiring resit. <Link to="/student/marks" className="font-bold underline">View Marks</Link></Alert>
      )}
      {isDeadlinePassed(settings.regDeadline) && (
        <Alert type="error">Course registration deadline has passed ({formatDate(settings.regDeadline)}). Contact admin for late registration.</Alert>
      )}
      {!isDeadlinePassed(settings.regDeadline) && (
        <Alert type="info">Course registration deadline: {formatDate(settings.regDeadline)}. <Link to="/student/courses" className="font-bold underline">Register Now</Link></Alert>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickLink to="/student/courses" icon="📚" title="Register Courses" desc="Browse and enroll in courses" color="blue" />
          <QuickLink to="/student/marks" icon="📝" title="My Marks" desc="View grades and download results" color="amber" />
          <QuickLink to="/student/attendance" icon="📅" title="Attendance" desc="View attendance records" color="green" />
          <QuickLink to="/student/fees" icon="💰" title="My Fees" desc="View payments and balance" color="red" />
          <QuickLink to="/student/timetable" icon="🕐" title="Timetable" desc="Your class schedule" color="slate" />
          <QuickLink to="/student/profile" icon="👤" title="Profile" desc="Update your information" color="teal" />
        </div>
        <Card className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Announcements</h3>
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm">{a.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{a.body}</p>
                <span className="text-xs text-gray-400 mt-2 block">{a.date}</span>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-sm text-gray-500">No announcements.</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

function StudentCourses() {
  const user = getUser(); const [courses, setCourses] = useState([]); const [enrolled, setEnrolled] = useState([])
  const [msg, setMsg] = useState(''); const [tab, setTab] = useState('available')
  const settings = initDB().settings

  useEffect(() => {
    const d = initDB()
    setCourses(d.courses.filter(c => c.dept === user.dept && c.level === user.level))
    setEnrolled(d.enrollments.filter(e => e.userId === user.id).map(e => e.courseId))
  }, [user])

  function register(cid) {
    if (isDeadlinePassed(settings.regDeadline)) { setMsg('Registration deadline has passed!'); return }
    const d = initDB(); d.enrollments.push({ userId: user.id, courseId: cid, semester: settings.currentSemester }); saveDB(d)
    setEnrolled([...enrolled, cid]); setMsg('Course registered successfully!')
    setTimeout(() => setMsg(''), 3000)
  }

  function drop(cid) {
    if (window.confirm('Drop this course?')) {
      const d = initDB(); d.enrollments = d.enrollments.filter(e => !(e.userId === user.id && e.courseId === cid))
      d.marks = d.marks.filter(m => !(m.userId === user.id && m.courseId === cid)); saveDB(d)
      setEnrolled(enrolled.filter(id => id !== cid))
    }
  }

  const available = courses.filter(c => !enrolled.includes(c.id))
  const registered = courses.filter(c => enrolled.includes(c.id))

  return (
    <div>
      <SectionTitle title="Course Registration" subtitle={`Available courses for ${user.dept} - ${user.level}`} action={isDeadlinePassed(settings.regDeadline) ? <Badge st="Registration Closed" type="status" /> : <Badge st={`Deadline: ${formatDate(settings.regDeadline)}`} type="status" />} />
      {msg && <Alert type={msg.includes('deadline') ? 'error' : 'success'} onClose={() => setMsg('')}>{msg}</Alert>}
      <TabBar tabs={[{ id: 'available', label: `Available (${available.length})` }, { id: 'registered', label: `Registered (${registered.length})` }]} active={tab} onChange={setTab} />
      {tab === 'available' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map(c => {
            const d = initDB(); const t = d.users.find(u => u.id === c.teacherId)
            return (
              <Card key={c.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded">{c.code}</span>
                  {c.resit && <Badge st="Resit" type="status" />}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{c.name}</h3>
                <p className="text-xs text-gray-500 mb-1">Lecturer: {t ? t.name : 'TBA'}</p>
                <p className="text-sm text-gray-500 mb-6">{c.credits} Credits | {c.semester}</p>
                <Button variant="primary" onClick={() => register(c.id)} className="w-full">Register</Button>
              </Card>
            )
          })}
          {available.length === 0 && <EmptyState icon="✅" title="All courses registered" subtitle="You have registered for all available courses" />}
        </div>
      )}
      {tab === 'registered' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Code</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Credits</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Lecturer</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {registered.map(c => {
                const d = initDB(); const t = d.users.find(u => u.id === c.teacherId)
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-teal-700">{c.code}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.credits}</td>
                    <td className="px-4 py-3 text-gray-500">{t ? t.name : 'TBA'}</td>
                    <td className="px-4 py-3"><Button variant="danger" onClick={() => drop(c.id)} className="text-xs py-1 px-2">Drop</Button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </Card>
      )}
    </div>
  )
}

function StudentMarks() {
  const user = getUser(); const [data, setData] = useState([]); const [resitCourses, setResitCourses] = useState([])
  const [msg, setMsg] = useState('')
  const settings = initDB().settings

  useEffect(() => {
    const d = initDB()
    const myEnrollments = d.enrollments.filter(e => e.userId === user.id)
    const rows = myEnrollments.map(e => {
      const c = d.courses.find(x => x.id === e.courseId)
      const m = d.marks.find(x => x.userId === user.id && x.courseId === e.courseId)
      return { code: c?.code, name: c?.name, credits: c?.credits, score: m?.score, grade: m?.grade, resit: m?.resit, courseId: e.courseId }
    })
    setData(rows)
    setResitCourses(d.courses.filter(c => c.resit && d.enrollments.find(e => e.userId === user.id && e.courseId === c.id)))
  }, [user])

  function registerResit(cid) {
    if (isDeadlinePassed(settings.resitDeadline)) { setMsg('Resit deadline has passed!'); return }
    const d = initDB()
    if (!d.enrollments.find(e => e.userId === user.id && e.courseId === cid)) {
      d.enrollments.push({ userId: user.id, courseId: cid, semester: settings.currentSemester })
    }
    saveDB(d); setMsg('Resit registered!')
    setTimeout(() => setMsg(''), 3000)
  }

  function downloadResult() {
    printResultSlip(user, data.filter(r => r.grade).map(r => ({ ...r, userId: user.id, courseId: r.courseId })), initDB().courses, settings)
  }

  function downloadTranscript() {
    printTranscript(user, data.filter(r => r.grade).map(r => ({ ...r, userId: user.id, courseId: r.courseId, semester: settings.currentSemester })), initDB().courses, settings)
  }

  return (
    <div>
      <SectionTitle title="My Marks" subtitle="Academic performance overview" action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadResult} className="text-xs">📄 Result Slip</Button>
          <Button variant="outline" onClick={downloadTranscript} className="text-xs">📋 Transcript</Button>
        </div>
      } />
      {msg && <Alert type={msg.includes('deadline') ? 'error' : 'success'} onClose={() => setMsg('')}>{msg}</Alert>}
      <Card className="overflow-hidden mb-6">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Code</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Course Name</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Credits</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Score</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Grade</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No courses registered yet.</td></tr> : data.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-teal-700">{r.code}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.credits}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{r.score !== undefined ? r.score : '-'}</td>
                <td className="px-4 py-3">{r.grade ? <><Badge st={r.grade} type="grade" />{r.grade === 'F' && <span className="text-xs text-red-600 ml-2">(Resit Required)</span>}</> : <span className="text-gray-400 text-xs">Pending</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
      {resitCourses.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Resit Courses</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {resitCourses.map(c => (
              <Card key={c.id} className="p-4 border-red-200 bg-red-50/30">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-red-800">{c.code}</span> - {c.name}
                    <p className="text-xs text-gray-500 mt-1">Resit Deadline: {formatDate(settings.resitDeadline)}</p>
                  </div>
                  <Button variant="danger" onClick={() => registerResit(c.id)} className="text-xs">Register Resit</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StudentAttendance() {
  const user = getUser(); const [att, setAtt] = useState([])
  useEffect(() => {
    const d = initDB(); const records = d.attendance.filter(a => a.userId === user.id).sort((a, b) => b.date.localeCompare(a.date))
    setAtt(records)
  }, [user])
  const present = att.filter(a => a.status === 'Present').length
  const rate = att.length ? Math.round(present / att.length * 100) : 0
  return (
    <div>
      <SectionTitle title="My Attendance" subtitle={`Overall attendance rate: ${rate}%`} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Present" value={present} color="green" />
        <StatCard title="Absent" value={att.filter(a => a.status === 'Absent').length} color="red" />
        <StatCard title="Late" value={att.filter(a => a.status === 'Late').length} color="amber" />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Time</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {att.length === 0 ? <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No attendance records found.</td></tr> : att.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{r.date}</td>
                <td className="px-4 py-3"><Badge st={r.status} /></td>
                <td className="px-4 py-3 text-gray-500">{r.time || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function StudentFees() {
  const user = getUser(); const [fees, setFees] = useState([])
  useEffect(() => { setFees(initDB().fees.filter(f => f.userId === user.id)) }, [user])
  const settings = initDB().settings
  return (
    <div>
      <SectionTitle title="My Fees" subtitle="Payment records and balance" />
      {isDeadlinePassed(settings.feeDeadline) && <Alert type="error">Fee payment deadline has passed ({formatDate(settings.feeDeadline)}). Contact admin for payment arrangements.</Alert>}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Semester</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Paid</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Balance</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {fees.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No fee records found.</td></tr> : fees.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{f.semester}</td>
                <td className="px-4 py-3 text-gray-600">{f.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">₦{f.paid.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">₦{(f.amount - f.paid).toLocaleString()}</td>
                <td className="px-4 py-3"><Badge st={f.status} type="payment" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}

function StudentTimetable() {
  const user = getUser(); const [list, setList] = useState([]); const [courses, setCourses] = useState([])
  useEffect(() => {
    const d = initDB(); const enrolledIds = d.enrollments.filter(e => e.userId === user.id).map(e => e.courseId)
    setList(d.timetable.filter(t => enrolledIds.includes(t.courseId))); setCourses(d.courses)
  }, [user])
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  return (
    <div>
      <SectionTitle title="My Timetable" subtitle="Your weekly class schedule" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map(day => {
          const dayItems = list.filter(t => t.day === day)
          return (
            <Card key={day} className="p-4">
              <h4 className="font-bold text-teal-800 mb-3">{day}</h4>
              <div className="space-y-2">
                {dayItems.map(t => { const c = courses.find(x => x.id === t.courseId); return (
                  <div key={t.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm">{c?.code}</p>
                    <p className="text-xs text-gray-500">{c?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.startTime} - {t.endTime}</p>
                    <p className="text-xs text-gray-400">{t.venue}</p>
                  </div>
                )})}
              </div>
            </Card>
          )
        })}
      </div>
      {list.length === 0 && <EmptyState icon="" title="No timetable" subtitle="Register for courses to see your schedule" />}
    </div>
  )
}

function StudentProfile() {
  const user = getUser()
  const [form, setForm] = useState({ ...user })
  const [msg, setMsg] = useState(''); const [tab, setTab] = useState('info')
  const [messageForm, setMessageForm] = useState({ subject: '', body: '' })
  const [myMessages, setMyMessages] = useState([])

  useEffect(() => {
    const d = initDB()
    setMyMessages(d.messages.filter(m => m.fromId === user.id || m.toId === user.id).sort((a, b) => b.date.localeCompare(a.date)))
  }, [user])

  function submit(e) {
    e.preventDefault()
    const d = initDB(); const idx = d.users.findIndex(u => u.id === user.id)
    if (idx >= 0) { d.users[idx] = { ...d.users[idx], ...form, role: 'student' }; saveDB(d); localStorage.setItem(AUTH_KEY, JSON.stringify(d.users[idx])); setMsg('Profile updated!'); setTimeout(() => setMsg(''), 3000) }
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm({ ...form, photo: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  function sendMessage(e) {
    e.preventDefault()
    const d = initDB()
    d.messages.push({ id: gid(), fromId: user.id, fromRole: 'student', toRole: 'superadmin', subject: messageForm.subject, body: messageForm.body, date: TODAY, read: false })
    saveDB(d); setMessageForm({ subject: '', body: '' }); setMsg('Message sent to admin!'); setTimeout(() => setMsg(''), 3000)
    setMyMessages(d.messages.filter(m => m.fromId === user.id || m.toId === user.id).sort((a, b) => b.date.localeCompare(a.date)))
  }

  return (
    <div>
      <SectionTitle title="My Profile" subtitle="Update your information and contact admin" />
      {msg && <Alert type="success" onClose={() => setMsg('')}>{msg}</Alert>}
      <TabBar tabs={[{ id: 'info', label: 'Personal Info' }, { id: 'photo', label: 'Profile Photo' }, { id: 'messages', label: 'Messages' }]} active={tab} onChange={setTab} />
      {tab === 'info' && (
        <Card className="p-6 max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Roll Number" value={form.roll} onChange={e => setForm({ ...form, roll: e.target.value })} required />
              <Input label="Gender" options={GENDERS} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Department" options={DEPTS} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} required />
              <Input label="Level" options={LEVELS} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} required />
            </div>
            <Button type="submit" variant="primary">Update Profile</Button>
          </form>
        </Card>
      )}
      {tab === 'photo' && (
        <Card className="p-6 max-w-md text-center">
          <h3 className="font-bold text-lg text-gray-900 mb-6">Profile Photo</h3>
          <PhotoUpload photo={form.photo} onChange={handlePhoto} size={160} />
          <Button variant="primary" onClick={submit} className="mt-6">Save Photo</Button>
        </Card>
      )}
      {tab === 'messages' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Contact Admin</h3>
            <form onSubmit={sendMessage} className="space-y-4">
              <Input label="Subject" value={messageForm.subject} onChange={e => setMessageForm({ ...messageForm, subject: e.target.value })} placeholder="Issue with my account..." required />
              <Input label="Message" rows={5} value={messageForm.body} onChange={e => setMessageForm({ ...messageForm, body: e.target.value })} placeholder="Describe your issue in detail..." required />
              <Button type="submit" variant="primary">Send Message</Button>
            </form>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Message History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {myMessages.map(m => (
                <div key={m.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-semibold text-sm text-gray-900">{m.subject}</p>
                  <p className="text-xs text-gray-600 mt-1">{m.body}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-400">{m.date}</span>
                    <span className={`text-xs ${m.fromRole === 'superadmin' ? 'text-blue-600' : 'text-teal-600'} font-medium`}>{m.fromRole === 'superadmin' ? 'Admin Reply' : 'Your Message'}</span>
                  </div>
                </div>
              ))}
              {myMessages.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No messages yet.</p>}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ==================== LAYOUTS ==================== */
function SidebarLayout({ badge, title, subtitle, menu, base, content }) {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const path = window.location.hash.split('/').pop() || 'dashboard'
  function go(id) { setOpen(false); nav(base + '/' + id) }
  return (
    <div className="min-h-screen flex bg-gray-50">
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-teal-900 text-white flex flex-col transform transition-transform duration-200 ease-out md:static md:translate-x-0 md:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-teal-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shrink-0"><span className="text-teal-950 font-black text-lg">{badge}</span></div>
          <div className="min-w-0"><h2 className="text-xs font-extrabold text-amber-300 truncate">{title}</h2><p className="text-xs text-teal-400 truncate">{subtitle}</p></div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menu.map(([id, i, l]) => (
            <button key={id} onClick={() => go(id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-medium transition ${path === id ? 'bg-amber-400 text-teal-900 font-bold' : 'text-teal-200 hover:bg-teal-800/50'}`}>
              <span className="w-6 h-6 flex items-center justify-center rounded bg-teal-800/60 text-xs font-bold shrink-0">{i}</span>{l}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-teal-800">
          <button onClick={() => { logout(); nav('/login') }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 text-sm font-medium">
            <span className="w-6 h-6 flex items-center justify-center rounded bg-red-500/20 text-xs font-bold">X</span>Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 bg-teal-900 text-white flex items-center gap-3 px-4 py-3 shadow-md">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-800 hover:bg-teal-700 text-lg font-bold">☰</button>
          <div className="min-w-0"><h2 className="text-sm font-extrabold text-amber-300 truncate">{title}</h2><p className="text-xs text-teal-400 truncate">{subtitle}</p></div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{content()}</main>
      </div>
    </div>
  )
}

function AdminLayout() {
  const menu = [['dashboard', 'D', 'Dashboard'], ['teachers', 'T', 'Teachers'], ['admissions', 'AD', 'Admissions'], ['students', 'S', 'Students'], ['courses', 'C', 'Courses'], ['semesters', 'SE', 'Semesters'], ['deadlines', 'DL', 'Deadlines'], ['announcements', 'A', 'Announcements'], ['messages', 'M', 'Messages'], ['timetable', 'TT', 'Timetable'], ['fees', 'F', 'Fees'], ['reports', 'R', 'Reports'], ['settings', 'SE', 'Settings']]
  function content() {
    const path = window.location.hash.split('/').pop() || 'dashboard'
    if (path === 'teachers') return <AdminTeachers />
    if (path === 'admissions') return <AdminAdmissions />
    if (path === 'students') return <AdminStudents />
    if (path === 'courses') return <AdminCourses />
    if (path === 'semesters') return <AdminSemesters />
    if (path === 'deadlines') return <AdminDeadlines />
    if (path === 'announcements') return <AdminAnnouncements />
    if (path === 'messages') return <AdminMessages />
    if (path === 'timetable') return <AdminTimetable />
    if (path === 'fees') return <AdminFees />
    if (path === 'reports') return <AdminReports />
    if (path === 'settings') return <AdminSettings />
    return <AdminDashboard />
  }
  return <SidebarLayout badge="SA" title="SUPER ADMIN" subtitle={initDB().settings.schoolName} menu={menu} base="/admin" content={content} />
}

function TeacherLayout() {
  const menu = [['dashboard', 'D', 'Dashboard'], ['students', 'S', 'My Students'], ['attendance', 'A', 'Attendance'], ['marks', 'M', 'Marks'], ['timetable', 'T', 'Timetable']]
  function content() {
    const path = window.location.hash.split('/').pop() || 'dashboard'
    if (path === 'students') return <TeacherStudents />
    if (path === 'attendance') return <TeacherAttendance />
    if (path === 'marks') return <TeacherMarks />
    if (path === 'timetable') return <TeacherTimetable />
    return <TeacherDashboard />
  }
  return <SidebarLayout badge="T" title="TEACHER PORTAL" subtitle={getUser()?.name} menu={menu} base="/teacher" content={content} />
}

function StudentLayout() {
  const menu = [['dashboard', 'D', 'Dashboard'], ['courses', 'C', 'Courses'], ['marks', 'M', 'My Marks'], ['attendance', 'A', 'Attendance'], ['timetable', 'T', 'Timetable'], ['fees', 'F', 'My Fees'], ['profile', 'P', 'Profile']]
  function content() {
    const path = window.location.hash.split('/').pop() || 'dashboard'
    if (path === 'courses') return <StudentCourses />
    if (path === 'marks') return <StudentMarks />
    if (path === 'attendance') return <StudentAttendance />
    if (path === 'timetable') return <StudentTimetable />
    if (path === 'fees') return <StudentFees />
    if (path === 'profile') return <StudentProfile />
    return <StudentDashboard />
  }
  return <SidebarLayout badge="S" title="STUDENT PORTAL" subtitle={getUser()?.name} menu={menu} base="/student" content={content} />
}

/* ==================== MAIN APP ==================== */
function Protect({ role, children }) {
  const u = getUser()
  if (!u) return <Navigate to="/login" replace />
  if (u.role !== role) return <Navigate to={u.role === 'superadmin' ? '/admin' : u.role === 'teacher' ? '/teacher' : '/student'} replace />
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/*" element={<Protect role="superadmin"><AdminLayout /></Protect>} />
        <Route path="/teacher/*" element={<Protect role="teacher"><TeacherLayout /></Protect>} />
        <Route path="/student/*" element={<Protect role="student"><StudentLayout /></Protect>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
