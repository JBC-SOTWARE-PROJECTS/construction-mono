import { gql } from "@apollo/client"

export const GET_PROJECTS_RECORDS = gql`
  query (
    $filter: String
    $customer: UUID
    $location: UUID
    $status: String
    $page: Int
    $size: Int
  ) {
    projectListPageable(
      filter: $filter
      customer: $customer
      location: $location
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        contractId
        projectCode
        description
        projectStarted
        projectEnded
        customer {
          id
          customerName
        }
        location {
          id
          officeDescription
          fullAddress
        }
        image
        remarks
        totals
        disabledEditing
        prefixShortName
        projectColor
        projectStatusColor
        projectPercent
        status
      }
      size
      totalElements
      number
    }
  }
`

export const UPSERT_RECORD_PROJECT = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertProject(id: $id, fields: $fields) {
      id
    }
  }
`

export const GET_PROJECT_BY_ID = gql`
  query ($id: UUID) {
    projectById(id: $id) {
      id
      contractId
      projectCode
      description
      projectStarted
      projectEnded
      customer {
        id
        customerName
        customerType
        address
        contactNo
        contactEmail
      }
      location {
        id
        officeDescription
        fullAddress
      }
      image
      remarks
      totals
      disabledEditing
      prefixShortName
      projectColor
      projectStatusColor
      status
    }
  }
`

export const GET_PROJECT_COST = gql`
  query ($filter: String, $id: UUID) {
    pCostByList(filter: $filter, id: $id) {
      id
      itemNo
      dateTransact
      description
      refNo
      unit
      relativeWeight
      totalCost
      billedQty
      category
      cost
      qty
      status
      tagNo
      lastModifiedBy
    }
  }
`

export const GET_PROJECT_OPT = gql`
  query ($filter: String, $id: UUID) {
    pCostByList(filter: $filter, id: $id) {
      value: id
      label: description
    }
  }
`

export const GET_PROJECT_WORK_BY_ID = gql`
  query ($id: UUID) {
    pCostById(id: $id) {
      id
      itemNo
      description
      unit
      relativeWeight
      qty
      cost
      billedQty
    }
  }
`

export const GET_PROJECT_COST_REV = gql`
  query ($id: UUID) {
    pCostRevByList(id: $id) {
      id
      prevDate
      qty
      unit
      cost
      totalCost
      tagNo
      createdBy
    }
  }
`

export const UPSERT_RECORD_PROJECT_COST = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertProjectCost(id: $id, fields: $fields) {
      payload
      success
      message
    }
  }
`

export const DELETE_PROJECT_COST_ITEM = gql`
  mutation ($id: UUID) {
    updateStatusCost(id: $id) {
      id
    }
  }
`

export const REVISE_RECORD_PROJECT_COST = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID, $tag: String) {
    reviseProjectCost(fields: $fields, id: $id, tag: $tag) {
      id
    }
  }
`

export const GET_RECORDS_PROJECT_ACCOMPLISHMENTS = gql`
  query ($filter: String, $id: UUID, $page: Int, $size: Int) {
    pUpdatesByPage(filter: $filter, id: $id, page: $page, size: $size) {
      content {
        id
        project {
          id
          location {
            id
          }
        }
        transNo
        dateTransact
        description
        accomplishment
        weather
        status
        createdBy
      }
      size
      totalElements
      number
    }
  }
`

export const UPSERT_RECORD_PROJECT_ACCOMPLISHMENT = gql`
  mutation ($fields: Map_String_ObjectScalar, $date: String, $id: UUID) {
    upsertProjectUpdates(fields: $fields, date: $date, id: $id) {
      payload
      success
      message
    }
  }
`

export const GET_RECORD_PROJECT_UPDATES_MATERIALS = gql`
  query ($id: UUID) {
    getProjectMaterialsByMilestone(id: $id) {
      id
      dateTransact
      descLong
      item {
        id
      }
      uou
      onHand
      qty
      balance
      subTotal
      cost
      remarks
      stockCardRefId
      createdBy
      lastModifiedBy
      lastModifiedDate
    }
  }
`

export const UPSERT_RECORD_PROJECT_ACCOMPLISHMENT_MATERIALS = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID) {
    upsertProjectMaterials(fields: $fields, id: $id) {
      payload
      success
      message
    }
  }
`

export const GET_INVENTORY_INFO = gql`
  query ($office: UUID, $itemId: UUID) {
    getInventoryInfo(office: $office, itemId: $itemId) {
      id
      item {
        id
        descLong
        unitOfUsage
        brand
      }
      onHand
      cost
    }
  }
`

export const REMOVE_MATERIAL = gql`
  mutation ($id: UUID) {
    removedMaterial(id: $id) {
      id
    }
  }
`

export const GET_RECORD_PROJECT_UPDATES_WORKERS = gql`
  query ($id: UUID) {
    pUpdatesWorkersByList(id: $id) {
      id
      dateTransact
      position
      amShift
      pmShift
      remarks
      createdBy
      lastModifiedBy
      lastModifiedDate
    }
  }
`

export const UPSERT_RECORD_PROJECT_WORKERS = gql`
  mutation ($fields: Map_String_ObjectScalar, $position: String, $id: UUID) {
    upsertProjectUpdatesWorkers(fields: $fields, position: $position, id: $id) {
      payload
      success
      message
    }
  }
`

export const REMOVE_RECORD_PROJECT_WORKERS = gql`
  mutation ($id: UUID) {
    removeProjectUpdateWorkers(id: $id) {
      payload
      success
      message
    }
  }
`

export const GET_RECORDS_PROJECT_PROGRESS = gql`
  query ($filter: String, $id: UUID, $page: Int, $size: Int) {
    pProgressByPage(filter: $filter, id: $id, page: $page, size: $size) {
      content {
        id
        transNo
        project {
          id
          location {
            id
          }
        }
        dateTransact
        description
        progress
        progressPercent
        status
        createdBy
      }
      size
      totalElements
      number
    }
  }
`

export const UPSERT_RECORD_PROJECT_PROGRESS = gql`
  mutation ($fields: Map_String_ObjectScalar, $date: String, $id: UUID) {
    upsertProjectProgress(fields: $fields, date: $date, id: $id) {
      payload
      success
      message
    }
  }
`

export const GET_PROGRESS_IMAGES = gql`
  query ($id: UUID) {
    pProgressImagesByList(id: $id) {
      id
      dateTransact
      folderName
      fileName
      mimetype
      imageUrl
    }
  }
`

export const REMOVE_PROGRESS_IMAGE = gql`
  mutation ($id: UUID) {
    removeProjectProgressImage(id: $id) {
      payload
      success
      message
    }
  }
`

export const GET_MATERIAL_USED_BY_PROJECT = gql`
  query ($id: UUID, $filter: String, $page: Int, $size: Int) {
    pMaterialByPage(id: $id, filter: $filter, page: $page, size: $size) {
      content {
        id
        projectUpdates {
          id
          transNo
        }
        dateTransact
        descLong
        uou
        onHand
        qty
        balance
        cost
        subTotal
        remarks
      }
      size
      totalElements
      number
    }
  }
`
