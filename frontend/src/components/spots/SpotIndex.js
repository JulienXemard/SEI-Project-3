import React from 'react'
import { getAllSpots } from '../../lib/api'
// import axios from 'axios'
import SpotCard from './SpotCard'
import SpotList from './SpotList'
import SpotMap from './SpotMap'

class SpotIndex extends React.Component {
  state = { 
    spots: null,
    searchTerm: '',
    hideMap: true,
    hideList: true,
    hideGrid: false,
    currentLocation: null
  }
  async componentDidMount() {
    console.log(this.props)
    window.navigator.geolocation.getCurrentPosition(data => {
      // console.log(data.coords)
      this.setState({ currentLocation: [data.coords.longitude, data.coords.latitude] })
    })
    try {
      // const res = await axios.get('/api/surfspots')
      const res = await getAllSpots()
      this.setState({ spots: res.data })
    } catch (err) {
      console.log(err)
    }
  }
  handleSearch = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  filteredSpots = () => {
    const { spots, searchTerm } = this.state
    const searchBar = new RegExp(searchTerm, 'i')
    console.log(searchBar)
    return spots.filter(spot => {
      return searchBar.test(spot.country) || searchBar.test(spot.continent) || searchBar.test(spot.spot) || searchBar.test(spot.difficulty) || searchBar.test(spot.season) || searchBar.test(spot.waveType)
    })
  }
  // function filterCountries() {
  //   const re = new RegExp(searchTerm, 'i')
  //   return countries.filter(country => {
  //     return re.test(country.name) && (country.region === currentRegion || currentRegion === 'All')
  //   })
  // }
  handleDisplayCard = e => {
    e.preventDefault()
    if (e.currentTarget.name === 'showList') {
      this.setState({ hideMap: true, hideList: false, hideGrid: true })
    } else if (e.currentTarget.name === 'showGrid') {
      this.setState({ hideMap: true, hideList: true, hideGrid: false })
    } else {
      this.setState({ hideMap: false, hideList: true, hideGrid: true })
    }
  }
  render() {
    if (!this.state.spots) return null
    console.log(this.state.spots)
    return (
      <div className="spotsCollection">
        <div className="hero is-medium index">
          <div className="hero-body has-bg-img">
            <h1 className="title nalu">N A L U</h1>
          </div>
        </div>
        <div className="field box index-search">
          <div className="control index-search-bar">
            <input className="input is-primary is-rounded"
              name="search"
              type="text"
              placeholder="Type the surf spots? Country? Continent? Difficulty? Wave Type or Season..."
              onChange={this.handleSearch}
            />
          </div>
        </div>
        <div className="view-change buttons field has-addons">
          <p className="control list-view-button">
            <button
              className="button"
              name="showList"
              onClick={this.handleDisplayCard}>
              <span className="icon is-small">
                <i className="fas fa-list"></i>
              </span>
            </button>
          </p>
          <p className="control">
            <button
              className="button"
              name="showGrid"
              onClick={this.handleDisplayCard}>
              <span className="icon is-small">
                <i className="fas fa-th"></i>
              </span>
            </button>
          </p>
          <p className="control">
            <button
              className="button"
              name="showMap"
              onClick={this.handleDisplayCard}>
              <span className="icon is-small">
                <i className="fas fa-map-pin"></i>
              </span>
            </button>
          </p>
        </div>
        <section className="section">
          <div className="container">
            <div className="columns is-multiline">
              {this.state.spots.map(spot => (
                <SpotCard key={spot._id} {...spot}/>
              ))}
            </div>
          </div>
        </section>
        <section className={`${this.state.hideList ? 'section spot-list is-hidden' : 'section spot-list'}`}>
        <div className="colmns is-multiline">
          {this.filteredSpots().map(spot => (
            <SpotList key={`List${spot._id}`} {...spot} />
          ))}
        </div>
        </section>
        <section className={`${this.state.hideGrid ? 'section spot-grid is-hidden' : 'spot-grid'}`}>
          <div className="container">
            <div className="columns is-multiline">
              {this.filteredSpots().map(spot => (
                <SpotCard key={`Grid${spot._id}`} {...spot} />
              ))}
            </div>
          </div>
        </section>
        <section className={`${this.state.hideMap ? 'section spot-map is-hidden' : 'spot-map'}`}>
          <SpotMap spots={this.filteredSpots()}/>
        </section>
      </div>
    )
  }
}
export default SpotIndex