import React, { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Alert, Button, Calendar, CalendarProps } from "antd";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { PlusCircleOutlined } from "@ant-design/icons";
import { GET_EVENTS } from "@/graphql/company/queries";
import { reject } from "lodash";
import { useQuery } from "@apollo/client";
import EventModal from "./event-modal";

interface selectedEvent {
  id?: string;
  name?: string;
  holidayType?: string;
  startDate?: Dayjs | any;
  endDate?: Dayjs | any;
  allDay?: boolean;
  fixed?: string;
}

const Event = () => {
  const [value, setValue] = useState<Dayjs>(dayjs());
  const [selectedValue, setSelectedValue] = useState<Dayjs | Date>(new Date());
  const [eventModal, setEventModal] = useState<any>(false);
  const [event, setEvent] = useState<any>(null);
  const [eventsList, setEventsList] = useState<any>([]);
  const [pendingEvents, setPendingEvents] = useState<any>([]);

  const { data, loading, refetch } = useQuery(GET_EVENTS);

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const getListData = (value: any) => {
    const date = value.format("YYYY-MM-DD");

    const filteredEvents = data?.events?.filter(
      (event: {
        startDate: string | number | Dayjs | Date | null | undefined;
      }) => dayjs(event.startDate).format("YYYY-MM-DD") === date
    );

    let listData: {
      id?: string;
      type?: string;
      content?: string;
    }[] = [];
    if (filteredEvents?.length > 0) {
      listData = filteredEvents.map(
        (event: { holidayType: any; name: any }) => ({
          type: event.holidayType,
          content: event.name,
        })
      );
    }

    return listData;
  };

  function typeOfHoliday(item: { id?: string; type?: string; content?: any }) {
    const holiday = data?.events?.find(
      (event: { name: any }) => event.name === item.content
    );
    let style: React.CSSProperties = {
      width: "100%",
      minHeight: "30px",
      borderRadius: "5px",
      textAlign: "center",
      padding: "3px",
      marginTop: "2px",
      marginBottom: "2px",
    };
    if (holiday) {
      if (holiday.holidayType === "REGULAR") {
        style.backgroundColor = "#2db7f5";
      } else if (holiday.holidayType === "SPECIAL_NON_WORKING") {
        style.backgroundColor = "#87d068";
      } else if (holiday.holidayType === "NON_HOLIDAY") {
        style.backgroundColor = "#ff9933";
      } else {
        throw new Error("None of the holiday type");
      }
    }
    return style;
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    const cellHeight = 50;
    return (
      <div className="events" style={{ height: `${cellHeight}px` }}>
        {listData.map((item) => (
          <div
            key={item?.id}
            style={typeOfHoliday(item)}
            onClick={() => handleClick(item)}
          >
            {item.content}
          </div>
        ))}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
  };

  const handleEventModal = (
    selectedEvent?: selectedEvent,
    willRefetch?: boolean,
    removeOptions?: any,
    event?: any
  ) => {
    let {
      clearPendingEvents,
      removeOneEvent = false,
      isEdit,
    } = removeOptions || {};
    if (selectedEvent) setEvent(selectedEvent);
    if (willRefetch) refetch();
    else if (clearPendingEvents) {
      if (removeOneEvent) {
        let newEvents = reject(eventsList, (item) => item.id === event.id);
        setEventsList(newEvents);
      } else {
        setPendingEvents([]);
        if (!isEdit) {
          if (event) {
            refetch();
            setEventsList([...eventsList, event]);
          }
        }
      }
    }

    setEventModal(!eventModal);
  };

  const handleClick = (item: {
    id?: string;
    type?: string;
    content?: string;
  }) => {
    const newData = data?.events?.find(
      (event: { name: any }) => event.name === item.content
    );

    let newEvent: selectedEvent = {
      id: newData?.id ?? null,
      fixed: newData?.fixed ?? null,
      name: newData?.name ?? null,
      holidayType: newData?.holidayType ?? null,
      startDate: newData?.startDate ? dayjs(newData?.startDate) : null,
      endDate: newData?.endDate ? dayjs(newData?.endDate) : null,
      allDay: true,
    };
    handleEventModal(newEvent);
    setPendingEvents([...pendingEvents, newEvent]);
  };

  return (
    <PageContainer title="Holiday & Events Calendar">
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Button
              form="upsertForm"
              type="primary"
              onClick={handleClick}
              icon={<PlusCircleOutlined />}
              loading={loading}
            >
              Add Events
            </Button>
          </ProFormGroup>
        }
      >
        <div style={{ height: "100vh" }}>
          <Alert
            message={`You selected date:  ${dayjs(selectedValue).format(
              "YYYY/MM/DD"
            )}`}
          />
          <Calendar
            fullscreen={true}
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            cellRender={cellRender}
          />
        </div>
        {eventModal && (
          <EventModal
            selectedEvent={event}
            visible={eventModal}
            hide={handleEventModal}
          />
        )}
      </ProCard>
    </PageContainer>
  );
};

export default Event;
