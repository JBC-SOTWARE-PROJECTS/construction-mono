import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  FormInstance,
  Input,
  InputNumber,
  InputNumberProps,
  InputRef,
  Select,
  SelectProps,
  Skeleton,
  Space,
  Spin,
} from 'antd'
import React, { useState, useRef, useContext, useEffect } from 'react'
import { CnEditableFieldTypeProps } from './props'
import {
  CnDispatch,
  CnLazyQuery,
  CnLoadingI,
  CnMutation,
  CnRefetchI,
} from './CreditNCreate'
import dayjs from 'dayjs'
import Highlighter from 'react-highlight-words'
import { ArCreditNoteItems } from '@/graphql/gql/graphql'
import { ColumnType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import { FilterConfirmProps } from 'antd/lib/table/interface'
import { StateI } from '.'
import { LazyQueryType } from '@/components/accountReceivables/common/types'
import {
  LazyQueryResultTuple,
  OperationVariables,
  useLazyQuery,
} from '@apollo/client'
import {
  ACCOUNT_OPTIONS_GQL,
  FIND_ONE_INVOICE_PARTICULAR,
  INVOICE_PARTICULAR_OPTIONS_GQL,
} from '@/graphql/accountReceivables/creditNote'

// FOR TABLE ROW

export interface EditableRowProps {
  index: number
}

interface EditableContextI {
  form: FormInstance<any>
  findOneItem: LazyQueryResultTuple<any, OperationVariables>
}

const EditableContext = React.createContext<EditableContextI | null>(null)

export const EditableRow: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm()
  const findOneItem = useLazyQuery(FIND_ONE_INVOICE_PARTICULAR)

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={{ form, findOneItem }}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

// FOR TABLE CELL
export interface EditableFieldTypeI {
  fieldType: 'DATE' | 'TEXT' | 'NUMBER' | 'OPTIONS' | 'SEARCH'
  dataIndex: string
  save: any
  inputRef: any
  lazyQuery: CnLazyQuery
}

export const EditableFieldType = (props: EditableFieldTypeI) => {
  const { dataIndex, save, fieldType, inputRef, lazyQuery } = props

  const [onSearchItem, { loading: onSearchItemLoading }] = useLazyQuery(
    INVOICE_PARTICULAR_OPTIONS_GQL
  )

  const [onSearchAccounts, { loading: onSearchAccountsLoading }] =
    useLazyQuery(ACCOUNT_OPTIONS_GQL)

  const [products, setProducts] = useState<any[]>([])

  const onSearch = (search: string) => {
    if (dataIndex == 'accountCode') {
      console.log(search, 'search')
      lazyQuery.lazyQueryAccountList({
        fetchPolicy: 'cache-and-network',
        variables: {
          accountCategory: '',
          accountType: '',
          motherAccountCode: '',
          subaccountType: '',
          accountName: search,
          department: '',
          excludeMotherAccount: true,
        },
        onCompleted: ({ coaList }: { coaList: any }) => {
          setProducts([...(coaList ?? [])])
        },
        onError: (error) => {
          if (error) {
            setProducts([])
            // message.error(
            //   'Something went wrong. Cannot generate Chart of Accounts'
            // )
          }
        },
      })
    } else
      onSearchItem({
        variables: {
          search,
          page: 0,
          size: 10,
        },
        onCompleted: ({ particulars }: { particulars: any }) => {
          setProducts([...(particulars?.content ?? [])])
        },
      })
  }

  useEffect(() => {
    if (fieldType == 'SEARCH') {
      if (dataIndex == 'accountCode') {
        onSearchAccounts({
          fetchPolicy: 'cache-and-network',
          variables: {
            accountCategory: '',
            accountType: '',
            motherAccountCode: '',
            subaccountType: '',
            description: '',
            department: '',
            excludeMotherAccount: true,
          },
          onCompleted: ({ coaList }: { coaList: any }) => {
            setProducts([...(coaList ?? [])])
          },
          onError: (error) => {
            if (error) {
              setProducts([])
            }
          },
        })
      } else
        lazyQuery.lazyQueryItemParticular({
          variables: {
            search: '',
            page: 0,
            size: 10,
          },
          onCompleted: ({ particulars }: { particulars: any }) => {
            setProducts([...(particulars?.content ?? [])])
          },
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFieldType = (type: any) => {
    switch (type) {
      case 'DATE':
        return (
          <DatePicker
            {...(CnEditableFieldTypeProps.datePicker as DatePickerProps)}
            onChange={save}
            onBlur={save}
          />
        )
      case 'NUMBER':
        return (
          <InputNumber
            {...(CnEditableFieldTypeProps.inputNumber as InputNumberProps)}
            onPressEnter={save}
            onBlur={save}
          />
        )
      case 'SEARCH':
        return (
          <Select
            {...(CnEditableFieldTypeProps.select as SelectProps)}
            onSearch={onSearch}
            onBlur={save}
            onSelect={save}
            options={products ?? []}
            loading={onSearchItemLoading || onSearchAccountsLoading}
            notFoundContent={
              onSearchItemLoading || onSearchAccountsLoading ? (
                <Spin size='small' />
              ) : null
            }
          />
        )
      default:
        return (
          <Input
            bordered={false}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            size='middle'
          />
        )
    }
  }

  return (
    <Form.Item style={{ margin: 0 }} name={dataIndex}>
      {getFieldType(fieldType)}
    </Form.Item>
  )
}

export interface CnTableHandleSaveI {
  record: ArCreditNoteItems
  state: StateI
  fields?: any
  dataIndex?: any
  dispatch: CnDispatch
  mutation?: CnMutation
}
export interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: any
  record: any
  fieldType: 'DATE' | 'TEXT' | 'NUMBER' | 'OPTIONS' | 'SEARCH'
  handleSave: (values: CnTableHandleSaveI, findItem: LazyQueryType) => void
  style: any
  lazyQuery: CnLazyQuery
  state: StateI
  dispatch: CnDispatch
  mutation?: CnMutation
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  fieldType,
  handleSave,
  lazyQuery,
  state,
  dispatch,
  mutation,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const { form, findOneItem } = useContext(EditableContext)!
  const [onFindOneItem, { loading: onFindOneItemLoading }] = findOneItem

  useEffect(() => {
    if (editing) {
      if (inputRef?.current) inputRef?.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    if (fieldType == 'DATE')
      form.setFieldsValue({ [dataIndex]: dayjs(record[dataIndex]) })
    else form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      const isArray = Array.isArray(dataIndex)

      toggleEdit()
      if (fieldType == 'DATE')
        handleSave(
          {
            record: { ...record, [dataIndex]: dayjs(values[dataIndex]) },
            fields: { [dataIndex]: dayjs(values[dataIndex]) },
            state,
            dispatch,
          },
          onFindOneItem
        )
      else {
        if (isArray) {
          handleSave(
            {
              record: { ...record },
              fields: { ...values },
              dataIndex,
              state,
              dispatch,
            },
            onFindOneItem
          )
        } else
          handleSave(
            {
              record: { ...record, ...values },
              fields: { ...values },
              dataIndex,
              state,
              dispatch,
            },
            onFindOneItem
          )
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (onFindOneItemLoading && dataIndex !== undefined) {
    childNode = <Skeleton.Input active={true} size={'small'} block />
  } else {
    if (editable) {
      childNode = editing ? (
        <EditableFieldType
          {...{
            inputRef,
            dataIndex,
            save,
            fieldType,
            lazyQuery,
          }}
        />
      ) : (
        <div
          className='editable-cell-value-wrap'
          style={{ paddingRight: 0, paddingLeft: 0 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }
  }

  return (
    <td
      {...restProps}
      style={{ ...(restProps?.style ?? {}), paddingTop: 5, paddingBottom: 5 }}
    >
      {childNode}
    </td>
  )
}

const handleSearch = (
  selectedKeys: string[],
  confirm: (param?: FilterConfirmProps) => void,
  dataIndex: any,
  setSearchText: any,
  setSearchedColumn: any
) => {
  confirm()
  setSearchText(selectedKeys[0])
  setSearchedColumn(dataIndex)
}

const handleReset = (clearFilters: () => void, setSearchText: any) => {
  clearFilters()
  setSearchText('')
}

export const getCnColumnSearchProps = (
  dataIndex: any,
  searchInput: any,
  searchedColumn: any,
  searchText: any,
  setSearchText: any,
  setSearchedColumn: any
): ColumnType<ArCreditNoteItems> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0] as number}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() =>
          handleSearch(
            selectedKeys as string[],
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type='primary'
          onClick={() =>
            handleSearch(
              selectedKeys as string[],
              confirm,
              dataIndex,
              setSearchText,
              setSearchedColumn
            )
          }
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() =>
            clearFilters && handleReset(clearFilters, setSearchText)
          }
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type='link'
          size='small'
          onClick={() => {
            confirm({ closeDropdown: false })
            setSearchText((selectedKeys as string[])[0])
            setSearchedColumn(dataIndex)
          }}
        >
          Filter
        </Button>
        <Button
          type='link'
          size='small'
          onClick={() => {
            close()
          }}
        >
          close
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined
      style={{ color: filtered ? '#1677ff' : 'black', fontSize: 15 }}
    />
  ),
  onFilter: (value, record: any) =>
    record[dataIndex]
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100)
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : text ? (
      text
    ) : dataIndex == 'itemName' ? (
      'Click to Select'
    ) : (
      ''
    ),
})

interface CnAddClaimsItemsI {
  state: StateI
  claimsDialog: any
  refetch?: CnRefetchI
}

export const onHandleCnAddClaimsItems = (props: CnAddClaimsItemsI) => {
  const { state, claimsDialog, refetch } = props
  const { id, customerId } = state
  const selected = state.dataSource.map((data) => data?.arInvoiceItem?.id)

  console.log(refetch, 'refetch')
  claimsDialog(
    {
      creditNoteId: id,
      customerId,
      invoiceType: state.invoiceType,
      transactionType: state.creditNoteType,
      selected,
    },
    (newItems: ArCreditNoteItems[]) => {
      console.log('YEAh')
      refetch?.creditNoteItem()
    }
  )
}
