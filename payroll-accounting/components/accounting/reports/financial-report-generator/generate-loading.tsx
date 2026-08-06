import { SyncOutlined } from "@ant-design/icons"
import { Progress, Result } from "antd"
import { useEffect, useState } from "react"

export default function GenerateFinReportGeneratorLoading(props: {
  start: boolean
  complete?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [subTitleIndex, setSubTitleIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const subtitles = [
    "Comprehensive breakdown of revenue streams and sources.",
    "Detailed analysis of expense categorization.",
    "Assessment of net profit after deductions.",
    // Add more subtitle texts here
  ]

  useEffect(() => {
    let intervalId: any

    if (loading) {
      intervalId = setInterval(() => {
        if (!props?.complete) {
          setSubTitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length)
          setProgress((prevProgress) => {
            const randomIncrement = Math.floor(Math.random() * 10) + 1
            let current = prevProgress
            if (current < 90) return (prevProgress + randomIncrement) % 100
            else return 99
          })
        }
      }, 2000)
    } else {
      clearInterval(intervalId)
    }

    return () => clearInterval(intervalId)
  }, [progress, loading, subtitles.length, props?.complete])
  console.log(progress, "progress")

  useEffect(() => {
    if (props?.start) {
      setLoading(true)
    }
    if (props?.complete) {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 1000)
    }
  }, [props?.start, props?.complete])

  return loading ? (
    <>
      <Result
        icon={<SyncOutlined spin />}
        title="Generating Report ..."
        subTitle={subtitles[subTitleIndex]}
        extra={
          <Progress style={{ width: 500 }} percent={progress} status="active" />
        }
      />
    </>
  ) : null
}
