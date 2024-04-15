package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.Assets
import org.springframework.data.jpa.repository.JpaRepository

interface AssetsRepository extends JpaRepository<Assets, UUID> {


}
