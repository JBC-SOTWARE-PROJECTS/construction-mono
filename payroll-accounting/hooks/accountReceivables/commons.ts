export function getInitials(fullName: string) {
  const names = fullName.split(' ')
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join('')
  return initials
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color
}

export function sortArrayText(first: string, second: string) {
  const nameA = (first ?? '').toUpperCase() // ignore upper and lowercase
  const nameB = (second ?? '').toUpperCase() // ignore upper and lowercase
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  // names must be equal
  return 0
}
