import "../css/Footer.css"
const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div><h2>AgroS</h2></div>
        <div>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-facebook-square"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-instagram-square"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-twitter-square"></i>
          </a>
        </div>

      </div>
      <div className="bottom">
        <div><h4>Project</h4>
          <a href="/">Status</a>
          <a href="/">All Versions</a>
        </div>
        <div>
          <h4>Community</h4>
          <a href="https://facebook.com/Vusefy" >Facebook</a>
          <a href="https://twitter.com/Vusefy">Twitter</a>
        </div>

        <div><h4>Help</h4>
          <a href="/contact">Support</a>
          <a href="/contact">Contact Us</a>
        </div>
        <div><h4>Others</h4>
          <a href="/service">Terms of Service</a>
          <a href="/about">About</a>
        </div>
      </div>
    </div>
  )
}
export default Footer;