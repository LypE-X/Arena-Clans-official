export const getTeamImage = (photoUrl?: string) => {
    if (!photoUrl) return '/logo.png'
  
    if (photoUrl.startsWith('blob:')) return photoUrl
    if (photoUrl.startsWith('data:image')) return photoUrl
  
    return `https://cdhwjnecglzfetmvyrwk.supabase.co/storage/v1/object/public/perfil_img/${photoUrl}`
  }