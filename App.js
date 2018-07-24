import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Share from "react-native-share";
import RNFetchBlob from "rn-fetch-blob";
import { PermissionsAndroid } from 'react-native';

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
        <TouchableOpacity onPress={this.checkStoragePermission}>
          <Text
            style={{
              fontSize: 20
            }}
          >
            Share
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  checkStoragePermission = async () => {
    const storagePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    storagePermission ? this.fetchImage() : this.requestStoragePermission();
  }

  requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'Storage Permission',
          'message': 'We need to access storage to share.'
        }
      );
      switch (granted) {
        case PermissionsAndroid.RESULTS.GRANTED:
          this.fetchImage();
          break;
        case PermissionsAndroid.RESULTS.DENIED:
          console.log("Storage Permission denied");
          this.shareContent('', false);
          break;
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          console.log("Permission not granted");
          break;
      }
    } catch (err) {
      console.warn(err)
    }
  }

  fetchImage = () => {
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: "jpg"
    })
      .fetch(
        "GET",
        "https://ecs7.tokopedia.net/img/cache/700/product-1/2017/9/29/5480510/5480510_c09d498b-2a52-4943-9b7b-0065eb91eb5a_372_400.jpg"
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
        this.shareContent(base64Data, true);
        // remove the file from storage
        return fs.unlink(imagePath);
      });
  };

  shareContent = (base64Data, shareWithImage) => {
    let shareOptions
    if (shareWithImage) {
      shareOptions = {
        title: "Tokopedia",
        message: "Hey Check this out tokopedia new product https://ecs7.tokopedia.net/img/cache/700/product-1/2017/7/31/3816301/3816301_17040cad-6b90-4184-b7ff-522e53a5c64d_2048_1638.jpg",
        url: `data:image/jpeg;base64,${base64Data}`,
        subject: "Share Link" //  for email
      };
    } else {
      shareOptions = {
        title: "Tokopedia",
        message: "Hey Check this out Tokopedia new product",
        url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2017/7/31/3816301/3816301_17040cad-6b90-4184-b7ff-522e53a5c64d_2048_1638.jpg',
        subject: "Share Link" //  for email
      };
    }

    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };


  share
}