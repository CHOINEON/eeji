import ineeji from 'assets/img/ineeji/ineeji.svg'
import { useHistory } from 'react-router-dom'

export default function Logo(props: any) {
  const history = useHistory()

  const handleLogoClick = () => {
    history.replace('/admin/main')
  }
  return (
    <button {...props} className="focus:outline-none">
      <img src={ineeji} onClick={handleLogoClick} alt="Logo" />
    </button>
  )
}
