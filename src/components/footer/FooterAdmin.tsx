import ineeji_logo from 'assets/img/ineeji/ineeji_logo_main.svg'

export default function Footer() {
  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center">
      <div className="text-gray-400 text-center xl:text-left">
        <span className="font-medium">
          <a
            href="https://www.ineeji.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 text-gray-400 font-bold"
          >
            <img src={ineeji_logo} alt="INEEJI Logo" className="inline ml-2" />
          </a>
          <p>Ⓒ INEEJI Corp. All rights reserved.</p>
        </span>
      </div>
    </div>
  )
}
