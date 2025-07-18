"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { 
  SimpleEventVisualizer, 
  SimpleVisualizerComponent, 
  type SimpleEventInstance,
  type EventTypeConfig
} from "../../src"

// カスタムイベントタイプ定義
const customEventTypes: EventTypeConfig = {
  eventTypes: {
    "file-operation": {
      name: "File Operation",
      icon: "FileText",
      color: {
        primary: "#3b82f6",
        secondary: "#dbeafe",
        background: "#eff6ff"
      },
      iconBackground: {
        primary: "#3b82f6",
        secondary: "#1d4ed8"
      }
    },
    "data-processing": {
      name: "Data Processing",
      icon: "Database",
      color: {
        primary: "#10b981",
        secondary: "#d1fae5",
        background: "#ecfdf5"
      },
      iconBackground: {
        primary: "#10b981",
        secondary: "#059669"
      }
    },
    "api-call": {
      name: "API Call",
      icon: "Globe",
      color: {
        primary: "#f59e0b",
        secondary: "#fef3c7",
        background: "#fffbeb"
      },
      iconBackground: {
        primary: "#f59e0b",
        secondary: "#d97706"
      }
    },
    "custom-operation": {
      name: "Custom Operation",
      icon: "Server",
      color: {
        primary: "#8b5cf6",
        secondary: "#ede9fe",
        background: "#f5f3ff"
      },
      iconBackground: {
        primary: "#8b5cf6",
        secondary: "#7c3aed"
      }
    },
    "database": {
      name: "Database",
      icon: "Database",
      color: {
        primary: "#06b6d4",
        secondary: "#cffafe",
        background: "#ecfeff"
      },
      iconBackground: {
        primary: "#06b6d4",
        secondary: "#0891b2"
      }
    },
    "notification": {
      name: "Notification",
      icon: "Bell",
      color: {
        primary: "#ef4444",
        secondary: "#fee2e2",
        background: "#fef2f2"
      },
      iconBackground: {
        primary: "#ef4444",
        secondary: "#dc2626"
      }
    }
  },
  defaultEventType: "file-operation",
  nodeStyles: {
    width: "280px",
    padding: "1rem",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }
}

export default function Home() {
  const visualizerRef = useRef<SimpleEventVisualizer | null>(null)
  const [events, setEvents] = useState<SimpleEventInstance[]>([])
  const [eventCount, setEventCount] = useState(0)

  // configオブジェクトをuseMemoでメモ化
  const visualizerConfig = useMemo(() => ({
    nodeSpacing: { x: 400, y: 300 },
    pipelineSpacing: 400,
    showControls: true,
    showMinimap: true,
    eventTypeConfig: customEventTypes
  }), [])

  useEffect(() => {
    if (!visualizerRef.current) {
      visualizerRef.current = new SimpleEventVisualizer(customEventTypes)
      
      visualizerRef.current.onUpdate((events: SimpleEventInstance[]) => {
        setEvents(events)
        setEventCount(events.length)
      })
    }
  }, [])

  const handleDemo = () => {
    const visualizer = visualizerRef.current
    if (!visualizer) return

    // Step 1: Load data
    visualizer.startEvent("load-data", {
      name: "Load Data",
      type: "file-operation",
      pipelineId: "demo",
    })

    setTimeout(() => visualizer.updateProgress("load-data", 50, "Reading file..."), 500)
    setTimeout(() => visualizer.updateProgress("load-data", 100, "Complete"), 1000)
    setTimeout(() => visualizer.completeEvent("load-data", true), 1000)

    // Step 2: Process data
    setTimeout(() => {
      visualizer.startEvent("process-data", {
        name: "Process Data",
        type: "data-processing",
        pipelineId: "demo",
        parentId: "load-data",
      })

      setTimeout(() => visualizer.updateProgress("process-data", 30, "Transforming..."), 600)
      setTimeout(() => visualizer.updateProgress("process-data", 60, "Aggregating..."), 1200)
      setTimeout(() => visualizer.updateProgress("process-data", 100, "Complete"), 1800)
      setTimeout(() => visualizer.completeEvent("process-data", true), 1800)
    }, 1000)

    // Step 3: Save result
    setTimeout(() => {
      visualizer.startEvent("save-result", {
        name: "Save Result",
        type: "api-call",
        pipelineId: "demo",
        parentId: "process-data",
      })

      setTimeout(() => visualizer.updateProgress("save-result", 50, "Saving..."), 600)
      setTimeout(() => visualizer.updateProgress("save-result", 100, "Complete"), 1200)
      setTimeout(() => visualizer.completeEvent("save-result", true), 1200)
    }, 1800)

    // Step 4: Custom operation
    setTimeout(() => {
      visualizer.startEvent("custom-op", {
        name: "Custom Operation",
        type: "custom-operation",
        pipelineId: "demo",
        parentId: "save-result",
      })

      setTimeout(() => visualizer.updateProgress("custom-op", 25, "Processing..."), 600)
      setTimeout(() => visualizer.updateProgress("custom-op", 75, "Almost done..."), 1200)
      setTimeout(() => visualizer.updateProgress("custom-op", 100, "Complete"), 1800)
      setTimeout(() => visualizer.completeEvent("custom-op", true), 1800)
    }, 2400)
  }

  const handleParallelDemo = () => {
    const visualizer = visualizerRef.current
    if (!visualizer) return

    // Step 1: Initialize parallel pipeline
    visualizer.startEvent("init-parallel", {
      name: "Initialize Parallel Pipeline",
      type: "file-operation",
      pipelineId: "parallel-demo",
    })

    setTimeout(() => visualizer.updateProgress("init-parallel", 100, "Ready for parallel execution"), 500)
    setTimeout(() => visualizer.completeEvent("init-parallel", true), 500)

    // Step 2: Start parallel tasks (all start at the same time)
    setTimeout(() => {
      // Parallel Task 1: Database Query
      visualizer.startEvent("db-query", {
        name: "Database Query",
        type: "database",
        pipelineId: "parallel-demo",
        parentId: "init-parallel",
      })

      // Parallel Task 2: API Call
      visualizer.startEvent("api-call", {
        name: "External API Call",
        type: "api-call",
        pipelineId: "parallel-demo",
        parentId: "init-parallel",
      })

      // Parallel Task 3: File Processing
      visualizer.startEvent("file-process", {
        name: "File Processing",
        type: "file-operation",
        pipelineId: "parallel-demo",
        parentId: "init-parallel",
      })

      // Parallel Task 4: Data Validation
      visualizer.startEvent("data-validation", {
        name: "Data Validation",
        type: "data-processing",
        pipelineId: "parallel-demo",
        parentId: "init-parallel",
      })

      // Simulate different completion times for parallel tasks
      // Task 1: Database Query (fastest)
      setTimeout(() => visualizer.updateProgress("db-query", 50, "Executing query..."), 200)
      setTimeout(() => visualizer.updateProgress("db-query", 100, "Query completed"), 800)
      setTimeout(() => visualizer.completeEvent("db-query", true), 800)

      // Task 2: API Call (medium)
      setTimeout(() => visualizer.updateProgress("api-call", 30, "Connecting..."), 300)
      setTimeout(() => visualizer.updateProgress("api-call", 60, "Fetching data..."), 600)
      setTimeout(() => visualizer.updateProgress("api-call", 100, "API response received"), 1200)
      setTimeout(() => visualizer.completeEvent("api-call", true), 1200)

      // Task 3: File Processing (slow)
      setTimeout(() => visualizer.updateProgress("file-process", 20, "Reading file..."), 400)
      setTimeout(() => visualizer.updateProgress("file-process", 40, "Processing chunks..."), 800)
      setTimeout(() => visualizer.updateProgress("file-process", 70, "Compressing..."), 1400)
      setTimeout(() => visualizer.updateProgress("file-process", 100, "File processed"), 2000)
      setTimeout(() => visualizer.completeEvent("file-process", true), 2000)

      // Task 4: Data Validation (medium-fast)
      setTimeout(() => visualizer.updateProgress("data-validation", 40, "Validating schema..."), 200)
      setTimeout(() => visualizer.updateProgress("data-validation", 80, "Checking constraints..."), 600)
      setTimeout(() => visualizer.updateProgress("data-validation", 100, "Validation passed"), 1000)
      setTimeout(() => visualizer.completeEvent("data-validation", true), 1000)

    }, 500)

    // Step 3: Aggregation (waits for all parallel tasks to complete)
    setTimeout(() => {
      visualizer.startEvent("aggregate-results", {
        name: "Aggregate Results",
        type: "data-processing",
        pipelineId: "parallel-demo",
        parentId: "init-parallel",
      })

      setTimeout(() => visualizer.updateProgress("aggregate-results", 30, "Collecting results..."), 300)
      setTimeout(() => visualizer.updateProgress("aggregate-results", 60, "Merging data..."), 600)
      setTimeout(() => visualizer.updateProgress("aggregate-results", 100, "Aggregation complete"), 900)
      setTimeout(() => visualizer.completeEvent("aggregate-results", true), 900)
    }, 2100) // Wait for the slowest task (file-process) to complete

    // Step 4: Final notification
    setTimeout(() => {
      visualizer.startEvent("send-notification", {
        name: "Send Notification",
        type: "notification",
        pipelineId: "parallel-demo",
        parentId: "aggregate-results",
      })

      setTimeout(() => visualizer.updateProgress("send-notification", 50, "Preparing notification..."), 200)
      setTimeout(() => visualizer.updateProgress("send-notification", 100, "Notification sent"), 400)
      setTimeout(() => visualizer.completeEvent("send-notification", true), 400)
    }, 3000)
  }

  const handleFailureDemo = () => {
    const visualizer = visualizerRef.current
    if (!visualizer) return

    // Step 1: Start with success
    visualizer.startEvent("init-failure-demo", {
      name: "Initialize Failure Demo",
      type: "file-operation",
      pipelineId: "failure-demo",
    })

    setTimeout(() => visualizer.updateProgress("init-failure-demo", 100, "Initialization complete"), 500)
    setTimeout(() => visualizer.completeEvent("init-failure-demo", true), 500)

    // Step 2: First step succeeds
    setTimeout(() => {
      visualizer.startEvent("step-1", {
        name: "Step 1 - Success",
        type: "data-processing",
        pipelineId: "failure-demo",
        parentId: "init-failure-demo",
      })

      setTimeout(() => visualizer.updateProgress("step-1", 50, "Processing..."), 300)
      setTimeout(() => visualizer.updateProgress("step-1", 100, "Step 1 completed"), 800)
      setTimeout(() => visualizer.completeEvent("step-1", true), 800)
    }, 500)

    // Step 3: Second step fails
    setTimeout(() => {
      visualizer.startEvent("step-2", {
        name: "Step 2 - Failure",
        type: "api-call",
        pipelineId: "failure-demo",
        parentId: "step-1",
      })

      setTimeout(() => visualizer.updateProgress("step-2", 30, "Connecting to API..."), 300)
      setTimeout(() => visualizer.updateProgress("step-2", 60, "Request sent..."), 600)
      setTimeout(() => visualizer.updateProgress("step-2", 80, "Timeout occurred"), 900)
      setTimeout(() => visualizer.completeEvent("step-2", false, "API timeout: Connection failed after 30 seconds"), 900)
    }, 1300)

    // Step 4: Retry attempt (also fails)
    setTimeout(() => {
      visualizer.startEvent("step-2-retry", {
        name: "Step 2 - Retry (Failed)",
        type: "api-call",
        pipelineId: "failure-demo",
        parentId: "step-1",
      })

      setTimeout(() => visualizer.updateProgress("step-2-retry", 20, "Retrying connection..."), 200)
      setTimeout(() => visualizer.updateProgress("step-2-retry", 40, "Authentication failed"), 400)
      setTimeout(() => visualizer.completeEvent("step-2-retry", false, "Authentication error: Invalid credentials"), 400)
    }, 1800)

    // Step 5: Alternative path (succeeds)
    setTimeout(() => {
      visualizer.startEvent("step-2-alternative", {
        name: "Step 2 - Alternative Path",
        type: "database",
        pipelineId: "failure-demo",
        parentId: "step-1",
      })

      setTimeout(() => visualizer.updateProgress("step-2-alternative", 50, "Using fallback database..."), 300)
      setTimeout(() => visualizer.updateProgress("step-2-alternative", 100, "Alternative path successful"), 800)
      setTimeout(() => visualizer.completeEvent("step-2-alternative", true), 800)
    }, 2300)

    // Step 6: Final step (succeeds despite previous failures)
    setTimeout(() => {
      visualizer.startEvent("step-3", {
        name: "Step 3 - Final Processing",
        type: "data-processing",
        pipelineId: "failure-demo",
        parentId: "step-2-alternative",
      })

      setTimeout(() => visualizer.updateProgress("step-3", 40, "Processing with partial data..."), 400)
      setTimeout(() => visualizer.updateProgress("step-3", 80, "Generating report..."), 800)
      setTimeout(() => visualizer.updateProgress("step-3", 100, "Pipeline completed with warnings"), 1200)
      setTimeout(() => visualizer.completeEvent("step-3", true), 1200)
    }, 3200)
  }

  const handleClear = () => {
    visualizerRef.current?.clear()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event Pipeline Visualizer
          </h1>
          <p className="text-gray-600">
            Simple and reliable event pipeline visualization with custom event types
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleDemo} className="w-full">
                  Run Demo
                </Button>
                <Button onClick={handleParallelDemo} className="w-full">
                  Run Parallel Demo
                </Button>
                <Button onClick={handleFailureDemo} className="w-full">
                  Run Failure Demo
                </Button>
                <Button onClick={handleClear} className="w-full" variant="outline">
                  Clear
                </Button>
                <div className="text-center pt-2">
                  <div className="text-lg font-bold text-blue-600">{eventCount}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualizer */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="pb-2">
                <CardTitle>Pipeline Visualization</CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0">
                <div className="w-full h-full">
                  <SimpleVisualizerComponent 
                    events={events}
                    config={visualizerConfig}
                    eventTypeConfig={customEventTypes}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
