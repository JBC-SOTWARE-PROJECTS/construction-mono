package com.backend.gbp.repository.projects

import com.backend.gbp.domain.projects.ProjectProgressImages
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectsProgressImagesRepository extends JpaRepository<ProjectProgressImages, UUID> {


}
