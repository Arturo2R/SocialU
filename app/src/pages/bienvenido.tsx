import React from 'react'
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient'
import * as reactSpring from '@react-spring/three'
import * as drei from '@react-three/drei'
import * as fiber from '@react-three/fiber'
import { Layout } from 'tabler-icons-react'

const Bienvenido = () => {
  return (
    <Layout>
    {/* <ShaderGradientCanvas
      importedFiber={{ ...fiber, ...drei, ...reactSpring }}
      style={{
          position: 'absolute',
          top: 0,
        }}
        >
      <ShaderGradient
        control='query'
        urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=1.5&cAzimuthAngle=60&cDistance=7.1&cPolarAngle=90&cameraZoom=15.3&color1=%23ff7a33&color2=%2333a0ff&color3=%23ffc53d&destination=onCanvas&embedMode=off&envPreset=dawn&format=gif&fov=45&frameRate=10&grain=off&http%3A%2F%2Flocalhost%3A3002%2Fcustomize%3Fanimate=on&lightType=3d&pixelDensity=1&positionX=0&positionY=-0.15&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=0&shader=defaults&type=sphere&uAmplitude=1.4&uDensity=1.1&uFrequency=5.5&uSpeed=0.1&uStrength=0.4&uTime=0&wireframe=false'
        />
    </ShaderGradientCanvas> */}
    Cada vez
    </Layout>
  )
}

export default Bienvenido