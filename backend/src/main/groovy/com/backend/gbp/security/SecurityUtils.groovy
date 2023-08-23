package com.backend.gbp.security

import com.backend.gbp.domain.CompanySettings
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder

class SecurityUtils {

	static List<String> getRoles() {
		def securityContext = SecurityContextHolder.getContext()
		def authentication = securityContext.authentication

		if (!authentication)
			return []

		def roles = []
		authentication.authorities.each {
			roles << (it as SimpleGrantedAuthority).authority
		}

		roles
	}

	static String currentLogin() {
		def securityContext = SecurityContextHolder.getContext()
		def authentication = securityContext.authentication

		if (!authentication)
			return "system"

		HISUser springSecurityUser
		String userName = null

		if (authentication != null) {
			if (authentication.principal.getClass() == HISUser) {
				springSecurityUser = authentication.principal as HISUser
				userName = springSecurityUser.username
			} else if (authentication.principal.getClass() == String) {
				userName = authentication.principal as String
			}
		}

		return userName
	}

	static UUID currentCompanyId() {
		def securityContext = SecurityContextHolder.getContext()
		def authentication = securityContext.authentication

		if (!authentication)
			return null

		HISUser springSecurityUser
		UUID company = null

		if (authentication != null) {
			if (authentication.principal.getClass() == HISUser) {
				springSecurityUser = authentication.principal as HISUser
				company = springSecurityUser.company
			} else if (authentication.principal.getClass() == String) {
				company = UUID.fromString(authentication.principal as String)
			}
		}

		return company
	}

	static CompanySettings currentCompany() {
		def securityContext = SecurityContextHolder.getContext()
		def authentication = securityContext.authentication

		if (!authentication)
			return null

		HISUser springSecurityUser
		CompanySettings company = null

		if (authentication != null) {
			if (authentication.principal.getClass() == HISUser) {
				springSecurityUser = authentication.principal as HISUser
				company = springSecurityUser.companyDomain
			} else if (authentication.principal.getClass() == String) {
				company = null
			}
		}

		return company
	}

}
