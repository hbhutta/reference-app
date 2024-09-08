import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Book from "@/constants/Book";

export default function TabTwoScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  async function getBookInfo(ISBN: String) {
    try {
      const book_info_response = await fetch(
        `https://openlibrary.org/isbn/${ISBN}.json`
      );
      const book_info_json = await book_info_response.json();

      let title = book_info_json.title;
      let number_of_pages = book_info_json.number_of_pages;
      let pub_year = book_info_json.publish_date.slice(-4);
      let cover_id = book_info_json.covers[0];
      let cover_img = await getCoverInfo(cover_id);

      let full_author_id = book_info_json.authors[0].key;

      var str: String = "/authors/OL59188A";

      var total_length: number = full_author_id.length; // "/authors/" is length 9
      var id_length: number = total_length - 9;
      var author_id: string = str.substring(id_length + 1);

      const author_name = await getAuthorInfo(author_id);

      const final_book_info = {
        _title: title,
        _author_name: author_name,
        _number_of_pages: number_of_pages,
        _cover_img: cover_img,
        _pub_year: pub_year,
      };

      console.log("final_book_info");
      console.log(final_book_info);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCoverInfo(cover_id: any) {
    const cover_img_response = await fetch(
      `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`
    );
    return cover_img_response.url;
  }

  async function getAuthorInfo(author_id: any) {
    const author_name_response = await fetch(
      `https://openlibrary.org/authors/${author_id}.json`
    );
    const author_name_json = await author_name_response.json();
    let author = author_name_json.alternate_names[0];
    return author;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"back"}
        onBarcodeScanned={async (scanningresult: BarcodeScanningResult) => {
          await getBookInfo(scanningresult.data);
        }}
      >
        <View style={styles.buttonContainer}></View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
