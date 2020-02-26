// utils
export const MAX_ITEMS_FOR_SINGLE_COLUMN = 11;

// /providers/110/youtube-tv/
export const ROUTE_REGEX = /\/providers\/([^\/]+)\/([^\/]+)/
export const getSelectedProvidersFromParams = (pathname='') => {
  const match = ROUTE_REGEX.exec(pathname) || []
  if(match.length > 2){
    return match[1].split(',').map(i => Number(i))
  } else {
    return []
  }
}
