import React from 'react'
import { AfricaBox, AmericasBox, AsiaBox, Container, ContainerInfo, EuropeBox, OceaniaBox } from './Styled'

const Header = () => {
  return (
    <div>
        <h2 style={{ margin: "1rem" }}>Population growth per country, 1950 to 2021</h2>
        <h3 style={{ margin: "1rem" }}>Click on the legend below to filter by continent<span>&#x1F447;</span></h3>
        <Container>
            <p>Region</p>
            <ContainerInfo><AsiaBox/>Asia</ContainerInfo>
            <ContainerInfo><EuropeBox/>Europe</ContainerInfo>
            <ContainerInfo><AfricaBox/>Africa</ContainerInfo>
            <ContainerInfo><OceaniaBox/>Oceania</ContainerInfo>
            <ContainerInfo><AmericasBox/>Americas</ContainerInfo>
        </Container>
    </div>
  )
}

export default Header
