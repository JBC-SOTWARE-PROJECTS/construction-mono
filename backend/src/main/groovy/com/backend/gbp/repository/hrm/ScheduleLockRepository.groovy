package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.ScheduleLock
import org.springframework.data.jpa.repository.JpaRepository


interface ScheduleLockRepository extends JpaRepository<ScheduleLock, UUID> {

}