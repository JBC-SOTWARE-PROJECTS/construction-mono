import { Bank } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const QUERY = gql`
  query ($filter: String, $page: Int, $size: Int) {
    banks: banks(filter: $filter, size: $size, page: $page) {
      content {
        id
        bankaccountId
        bankname
        branch
        bankAddress
        accountName
        accountNumber
        createdDate
        acquiringBank
      }
      totalPages
      size
      number
    }
  }
`

interface BankProps {
  filter?: string
  page?: number
  size?: number
}

const useBank = (props?: BankProps) => {
  const [bank, setBank] = useState([])

  useEffect(() => {
    const fetchHooks = async () => {
      try {
        const { data } = await client.query({
          query: QUERY,
          variables: { filter: "", page: 0, size: 10, ...props },
        })
        setBank(data?.banks?.content ?? [])
      } catch (error) {
        console.error("Error fetching hooks:"), error
      }
    }

    fetchHooks()

    // Cleanup function if necessary
    return () => {
      // Any cleanup code here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to run only once on component mount

  return { data: bank }
}

export const useBankOpt = (props?: BankProps) => {
  const { data } = useBank(props)

  return (data ?? []).map((bank: Bank) => ({
    label: bank.bankname,
    value: bank.id,
  }))
}

export const useAcquisitionBankOpt = (props?: BankProps) => {
  const { data } = useBank(props)

  return (data ?? [])
    .filter((bank: Bank) => bank.acquiringBank)
    .map((bank: Bank) => ({
      label: bank.bankname,
      value: bank.id,
    }))
}

export default useBankOpt
