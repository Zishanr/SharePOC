import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Share from "react-native-share";
import RNFetchBlob from "rn-fetch-blob";

export default class App extends PureComponent {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={this._shareImage}>
          <Text
            style={{
              fontSize: 50
            }}
          >
            Share
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _shareImage = () => {
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: "png"
    })
      .fetch(
        "GET",
        "https://cdn.myntassets.com/myx/images/icon.5d108c858a0db793700f0be5d3ad1e120a01a500.png"
      )
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        console.log("imagePath", imagePath);
        return resp.readFile("base64");
      })
      .then(base64Data => {
        // here's base64 encoded image
        console.log("base64Data", base64Data);
        this._clickShare(base64Data);
        // remove the file from storage
        // return fs.unlink(imagePath);
      });
  };

  _clickShare = base64Data => {
    let shareOptions = {
      title: "React Native",
      message: "Hola mundo http://facebook.github.io/react-native/",
      url: `data:image/png;base64,${base64Data}`,
      subject: "Share Link" //  for email
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };
}