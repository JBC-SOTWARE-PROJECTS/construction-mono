import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import axios from "axios"
import { useState, useEffect } from "react"

const useMacAddress = () => {
  const [hooks, setHooks] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchHooks = async () => {
      try {
        axios
          .get("https://hisd3.lvh.me:4567/macaddress")
          .then((response) => {
            setLoading(false)
            setHooks(response.data)
          })
          .catch((error) => {
            setHooks("44-AF-28-8F-AC-4B")
            setLoading(false)
            // setError(true)
          })
      } catch (error) {
        console.error("Error fetching hooks:"), error
      }
    }

    fetchHooks()

    // Cleanup function if necessary
    return () => {
      // Any cleanup code here
    }
  }, []) // Empty dependency array to run only once on component mount

  return { data: hooks, loading }
}

export default useMacAddress
