package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.EventCalendar
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.EventCalendarRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.stream.Collectors

enum EventCalendarTransferabilityType {
    FIXED, MOVABLE
}

enum EventCalendarHolidayType {
    REGULAR, SPECIAL_NON_WORKING, NON_HOLIDAY
}

@TypeChecked
@Component
@GraphQLApi
class EventCalendarService {

    @Autowired
    EventCalendarRepository eventCalendarRepository

    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    //===========================Query===========================\\

    @GraphQLQuery(name = "getEventsBetweenTwoDates", description = "Filter Event Calendar between two dates.")
    List<EventCalendar> getEventsBetweenTwoDates(
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate
    ) {
        eventCalendarRepository.getEventsBetweenTwoDates(startDate, endDate)
    }

    @GraphQLQuery(name = "mapEventsToDates", description = "Filter Event Calendar between two dates.")
    Map<String, List<EventCalendar>> mapEventsToDates(
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate
    ) {
        Map<String, List<EventCalendar>> holidays = entityManager.createQuery("""
            Select e from EventCalendar e
            where
                e.startDate >= :startDate and e.endDate <= :endDate
            order by e.startDate
        """).setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultStream()
                .collect(Collectors.groupingBy({
                    EventCalendar d ->
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.systemDefault())
                        String dateTime = formatter.format(d.startDate)
                        return dateTime
                })) as Map
        return holidays
    }

    @GraphQLQuery(name = "getCalendarEvents", description = "Get all calendar events")
    List<EventCalendar> getCalendarEvents() {
        return eventCalendarRepository.findAll()
    }

    //===========================Query===========================\\

    //==========================Mutation=========================\\

    @GraphQLMutation(name = "upsertEventCalendar", description = "Create or edit event calendar.")
    GraphQLRetVal<EventCalendar> upsertEventCalendar(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        CompanySettings company = SecurityUtils.currentCompany()
        if (id) {
            EventCalendar calendar = eventCalendarRepository.findById(id).get()
            calendar.company = company
            calendar = objectMapper.updateValue(calendar, fields)
            calendar = eventCalendarRepository.save(calendar)
            return new GraphQLRetVal<EventCalendar>(calendar, true, "Successfully updated event calendar.")
        } else {
            EventCalendar calendar = objectMapper.convertValue(fields, EventCalendar)
            calendar.company = company
            calendar = eventCalendarRepository.save(calendar)
            return new GraphQLRetVal<EventCalendar>(calendar, true, "Successfully created event calendar")
        }
    }

    @GraphQLMutation(name = "deleteEventCalendar", description = "Delete one event calender.")
    GraphQLRetVal<String> deleteEventCalendar(@GraphQLArgument(name = "id") UUID id) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete event calendar")
        EventCalendar calendar = eventCalendarRepository.findById(id).get()
        eventCalendarRepository.delete(calendar)
        return new GraphQLRetVal<String>("OK", true, "Successfully deleted event.")
    }
}
