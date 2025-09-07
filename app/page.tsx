"use client"

import { useState, useMemo } from "react"
import { Search, Users, Clock, CheckSquare, X, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const students = [
  { id: "3847291", name: "Sarah Johnson" },
  { id: "9182736", name: "Michael Chen" },
  { id: "5647382", name: "Emily Rodriguez" },
  { id: "7293847", name: "David Thompson" },
  { id: "8374629", name: "Jessica Williams" },
  { id: "4729384", name: "Robert Martinez" },
  { id: "6384729", name: "Amanda Foster" },
  { id: "9273648", name: "Christopher Lee" },
  { id: "5847392", name: "Nicole Anderson" },
  { id: "7384629", name: "Brandon Wilson" },
  { id: "3947582", name: "Stephanie Garcia" },
  { id: "8274639", name: "Kevin Brown" },
  { id: "5739284", name: "Rachel Davis" },
  { id: "9384726", name: "Tyler Miller" },
  { id: "6472839", name: "Ashley Taylor" },
  { id: "8394756", name: "Jonathan Moore" },
  { id: "4738295", name: "Samantha White" },
  { id: "7295847", name: "Daniel Jackson" },
  { id: "5847393", name: "Lauren Harris" },
  { id: "9384757", name: "Ryan Clark" },
  { id: "6273840", name: "Megan Lewis" },
  { id: "8475630", name: "Andrew Walker" },
  { id: "3947583", name: "Brittany Hall" },
  { id: "7384630", name: "Justin Allen" },
  { id: "5729384", name: "Kayla Young" },
  { id: "9273649", name: "Nathan King" },
  { id: "6384730", name: "Alexis Wright" },
  { id: "8475631", name: "Jordan Lopez" },
  { id: "4738296", name: "Hannah Hill" },
  { id: "7295848", name: "Zachary Scott" },
  { id: "5847394", name: "Victoria Green" },
  { id: "9384758", name: "Cameron Adams" },
  { id: "6273841", name: "Jasmine Baker" },
  { id: "8475632", name: "Mason Gonzalez" },
  { id: "3947584", name: "Destiny Nelson" },
  { id: "7384631", name: "Isaiah Carter" },
  { id: "5729385", name: "Paige Mitchell" },
  { id: "9273650", name: "Caleb Perez" },
  { id: "6384731", name: "Sierra Roberts" },
  { id: "8475633", name: "Ethan Turner" },
  { id: "4738297", name: "Maya Phillips" },
  { id: "7295849", name: "Lucas Campbell" },
  { id: "5847395", name: "Jenna Parker" },
  { id: "9384759", name: "Gavin Evans" },
  { id: "6273842", name: "Chloe Edwards" },
  { id: "8475634", name: "Owen Collins" },
  { id: "3947585", name: "Kimberly Stewart" },
  { id: "7384632", name: "Hunter Sanchez" },
  { id: "5729386", name: "Gabrielle Morris" },
  { id: "9273651", name: "Landon Rogers" },
  { id: "6384732", name: "Mariah Reed" },
  { id: "8475635", name: "Colton Cook" },
  { id: "4738298", name: "Ariana Bailey" },
  { id: "7295850", name: "Wyatt Rivera" },
  { id: "5847396", name: "Natalie Cooper" },
  { id: "9384760", name: "Blake Richardson" },
  { id: "6273843", name: "Leah Cox" },
  { id: "8475636", name: "Carson Howard" },
  { id: "3947586", name: "Sophia Ward" },
  { id: "7384633", name: "Bryce Torres" },
  { id: "5729387", name: "Mackenzie Peterson" },
  { id: "9273652", name: "Tristan Gray" },
  { id: "6384733", name: "Brooke Ramirez" },
  { id: "8475637", name: "Hayden James" },
  { id: "4738299", name: "Allison Watson" },
  { id: "7295851", name: "Parker Brooks" },
  { id: "5847397", name: "Vanessa Kelly" },
  { id: "9384761", name: "Brayden Sanders" },
  { id: "6273844", name: "Haley Price" },
  { id: "8475638", name: "Connor Bennett" },
  { id: "3947587", name: "Isabelle Wood" },
  { id: "7384634", name: "Dominic Barnes" },
  { id: "5729388", name: "Madeline Ross" },
  { id: "9273653", name: "Jaxon Henderson" },
  { id: "6384734", name: "Savannah Coleman" },
  { id: "8475639", name: "Easton Jenkins" },
  { id: "4738300", name: "Addison Perry" },
  { id: "7295852", name: "Nolan Powell" },
  { id: "5847398", name: "Aubrey Long" },
  { id: "9384762", name: "Ian Patterson" },
  { id: "6273845", name: "Claire Hughes" },
  { id: "8475640", name: "Adrian Flores" },
  { id: "3947588", name: "Ella Washington" },
  { id: "7384635", name: "Jeremiah Butler" },
  { id: "5729389", name: "Layla Simmons" },
]

export default function QuizExtensions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [selectedExtension, setSelectedExtension] = useState("1.5")
  const [customExtension, setCustomExtension] = useState("")
  const [useCustom, setUseCustom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<"refreshing" | "updating" | "complete">("refreshing")
  const [refreshProgress, setRefreshProgress] = useState(0)
  const [updateProgress, setUpdateProgress] = useState(0)
  const [processingResults, setProcessingResults] = useState<{
    updatedQuizzes: number
    studentsAffected: number
    unchangedQuizzes: number
    extensionPercentage: number
  } | null>(null)
  const [showResults, setShowResults] = useState(false)

  const extensionOptions = [
    { value: "1.25", label: "Time and a Quarter (1.25x)" },
    { value: "1.5", label: "Time and a Half (1.5x)" },
    { value: "2", label: "Double Time (2x)" },
    { value: "2.5", label: "Two and a Half Times (2.5x)" },
    { value: "3", label: "Triple Time (3x)" },
  ]

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.id.includes(searchTerm),
    )
  }, [searchTerm])

  const handleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)))
    }
  }

  const handleClearSelection = () => {
    setSelectedStudents(new Set())
  }

  const handleSubmit = () => {
    setShowModal(true)
  }

  const handleConfirmSubmit = async () => {
    const extension = useCustom ? customExtension : selectedExtension
    const percentage = Math.round(Number.parseFloat(extension) * 100)
    const selectedStudentData = students.filter((s) => selectedStudents.has(s.id))

    setIsProcessing(true)
    setProcessingStep("refreshing")
    setRefreshProgress(0)
    setUpdateProgress(0)

    for (let i = 0; i <= 100; i += 10) {
      setRefreshProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setProcessingStep("updating")

    for (let i = 0; i <= 100; i += 10) {
      setUpdateProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 150))
    }

    setProcessingResults({
      updatedQuizzes: Math.floor(Math.random() * 10) + 5,
      studentsAffected: selectedStudentData.length,
      unchangedQuizzes: Math.floor(Math.random() * 8) + 2,
      extensionPercentage: percentage,
    })

    setProcessingStep("complete")
  }

  const handleCloseProcessing = () => {
    setIsProcessing(false)
    setShowModal(false)
    setSelectedStudents(new Set())
    setUseCustom(false)
    setCustomExtension("")
    setSelectedExtension("1.5")
    setProcessingResults(null)
    setProcessingStep("refreshing")
    setRefreshProgress(0)
    setUpdateProgress(0)
    setShowResults(false)
  }

  const handleViewResults = () => {
    setShowResults(true)
  }

  const getCurrentExtension = () => {
    const extension = useCustom ? customExtension : selectedExtension
    return extension ? Math.round(Number.parseFloat(extension) * 100) : 150
  }

  const isAllSelected = filteredStudents.length > 0 && selectedStudents.size === filteredStudents.length
  const isPartiallySelected = selectedStudents.size > 0 && selectedStudents.size < filteredStudents.length

  const mockUpdatedQuizzes = [
    { title: "New ProctorHub Quiz - Oct 16 2020", minutesExtended: 5 },
    { title: "ProctorHub Multiple Page Quiz", minutesExtended: 60 },
    { title: "ProctorHub Single Page Quiz", minutesExtended: 90 },
    { title: "ProctorHub Test [PICK ME]", minutesExtended: 30 },
    { title: "Quizext Test", minutesExtended: 5 },
    { title: "Unnamed Quiz", minutesExtended: 15 },
    { title: "Unnamed Quiz", minutesExtended: 5 },
    { title: "new 10 min", minutesExtended: 5 },
  ]

  const mockUnchangedQuizzes = [
    "Able Quiz test",
    "New ProctorHub Quiz - Mar 29 2021",
    "New ProctorHub Quiz - Sep 07 2022",
    "Quiz Save Test",
    "Unnamed Quiz",
  ]

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quiz Extensions</h1>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 leading-relaxed">
              This tool will apply extra time to <strong>all existing</strong> quizzes/exams. For example, if Suzy
              Johnson and Stephen Smith need Time and a Half, select the students below and choose the appropriate
              amount of extra time (e.g., Time and a half - 1.5x).
            </p>
            <p className="text-blue-800 text-sm mt-2">
              If additional quizzes/exams are added during the semester, a message will appear stating there are new
              quizzes which need extensions. Click the <strong>Apply Now</strong> button to add the same extensions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Student List</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{filteredStudents.length} students</span>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="h-96 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => {
                      const isSelected = selectedStudents.has(student.id)
                      return (
                        <tr
                          key={student.id}
                          className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-100 border-l-4 border-l-blue-500" : ""
                          }`}
                          onClick={() => handleSelectStudent(student.id)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-600 font-mono">{student.id}</div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredStudents.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No students found matching your search.</p>
              </div>
            )}

            <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
              Click on students to select them
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Selected Students</h2>
                {selectedStudents.size > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    {selectedStudents.size} selected
                  </Badge>
                )}
              </div>
            </div>

            <div className="h-96 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {selectedStudents.size > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {students
                      .filter((student) => selectedStudents.has(student.id))
                      .map((student) => (
                        <div key={student.id} className="p-4 hover:bg-gray-50 flex items-center justify-between group">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600 font-mono">{student.id}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectStudent(student.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">No students selected</p>
                      <p className="text-gray-400 text-xs mt-1">Click students from the left to add them</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearSelection}
                  disabled={selectedStudents.size === 0}
                  className="flex-1 bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedStudents.size === 0}
                  className="flex-1"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>

              {selectedStudents.size > 0 && (
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Ready to apply extensions to {selectedStudents.size} student{selectedStudents.size !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Built by <span className="text-blue-600 font-medium">UCF CDL</span> © 2025
        </div>
      </div>

      {showModal && !isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Extend Time</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-gray-700 leading-relaxed">
                <p>Choose a predetermined extension or set a custom extension represented by percentage.</p>
                <p className="text-sm text-gray-600 mt-1">For example, double time and a half would be 250%.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <select
                        value={useCustom ? "" : selectedExtension}
                        onChange={(e) => {
                          setSelectedExtension(e.target.value)
                          setUseCustom(false)
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                        disabled={useCustom}
                      >
                        {extensionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <span className="text-gray-500 font-medium">or</span>

                  <div className="flex items-center">
                    <Input
                      type="number"
                      placeholder="150"
                      value={customExtension}
                      onChange={(e) => {
                        setCustomExtension(e.target.value)
                        setUseCustom(e.target.value !== "")
                      }}
                      className="w-24 text-center"
                      min="100"
                      max="500"
                      step="25"
                    />
                    <span className="ml-2 text-gray-700 font-medium">%</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 font-medium">
                  The following students will have <span className="font-bold">{getCurrentExtension()}%</span> of normal
                  time on all quizzes:
                </p>
              </div>

              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                <div className="divide-y divide-gray-200">
                  {students
                    .filter((student) => selectedStudents.has(student.id))
                    .map((student) => (
                      <div key={student.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600 font-mono">{student.id}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button variant="outline" onClick={() => setShowModal(false)} className="px-6">
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                className="px-6 bg-[oklch(0.5006_0.175168_256.6411)] hover:bg-[oklch(0.3719_0.117_255.1)] text-white"
                disabled={(!useCustom && !selectedExtension) || (useCustom && !customExtension)}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Extend Time</h2>
              {processingStep === "complete" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseProcessing}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {processingStep === "refreshing" ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  ) : (
                    <CheckSquare className="h-5 w-5 text-green-600" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">Refreshing Quizzes</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Checking quiz status...</span>
                    <span className="font-medium text-gray-900">{refreshProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[oklch(0.5006_0.175168_256.6411)] h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${refreshProgress}%` }}
                    />
                  </div>
                </div>

                {processingStep !== "refreshing" && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                    <CheckSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Complete. Quizzes ready for updates.</span>
                  </div>
                )}
              </div>

              {(processingStep === "updating" || processingStep === "complete") && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {processingStep === "updating" ? (
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900">Updating Quizzes</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Applying time extensions...</span>
                      <span className="font-medium text-gray-900">{updateProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[oklch(0.5006_0.175168_256.6411)] h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${updateProgress}%` }}
                      />
                    </div>
                  </div>

                  {processingStep === "complete" && processingResults && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">Extensions applied successfully.</span>
                    </div>
                  )}
                </div>
              )}

              {processingStep === "complete" && processingResults && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="h-6 w-6 text-green-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Success!</h4>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-medium">{processingResults.updatedQuizzes} quizzes</span> have been
                        updated for <span className="font-medium">{processingResults.studentsAffected} student(s)</span>{" "}
                        to have <span className="font-medium">{processingResults.extensionPercentage}% time</span>.{" "}
                        <span className="font-medium">{processingResults.unchangedQuizzes} quizzes</span> have no time
                        limit and were left unchanged.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {processingStep === "complete" && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button variant="outline" onClick={handleCloseProcessing} className="px-6 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
                <Button onClick={handleViewResults} className="px-6 bg-[oklch(0.5006_0.175168_256.6411)] hover:bg-[oklch(0.3719_0.117_255.1)] text-white">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {showResults && processingResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Extension Results</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseProcessing}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div className="space-y-6">
                {/* Success Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="h-6 w-6 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">Success!</h3>
                      <p className="text-green-800 leading-relaxed">
                        <span className="font-medium">{processingResults.updatedQuizzes} quizzes</span> have been
                        updated for <span className="font-medium">{processingResults.studentsAffected} student(s)</span>{" "}
                        to have <span className="font-medium">{processingResults.extensionPercentage}% time</span>.{" "}
                        <span className="font-medium">{processingResults.unchangedQuizzes} quizzes</span> have no time
                        limit and were left unchanged.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Updated Quizzes Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Updated Quizzes</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      {mockUpdatedQuizzes.length} quizzes
                    </Badge>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quiz Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Minutes Extended
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockUpdatedQuizzes.map((quiz, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 font-mono">{quiz.minutesExtended} min</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Unchanged Quizzes Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Unchanged Quizzes</h3>
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      {mockUnchangedQuizzes.length} quizzes
                    </Badge>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      These quizzes have no time limit and were left unchanged:
                    </p>
                    <div className="space-y-2">
                      {mockUnchangedQuizzes.map((quiz, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-700">{quiz}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button onClick={handleCloseProcessing} className="px-6 bg-[oklch(0.5006_0.175168_256.6411)] hover:bg-[oklch(0.3719_0.117_255.1)] text-white">
                <CheckSquare className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
