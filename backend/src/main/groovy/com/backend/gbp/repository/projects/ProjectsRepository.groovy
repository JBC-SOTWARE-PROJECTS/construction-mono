package com.backend.gbp.repository.projects


import com.backend.gbp.domain.projects.Projects
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectsRepository extends JpaRepository<Projects, UUID> {


}
