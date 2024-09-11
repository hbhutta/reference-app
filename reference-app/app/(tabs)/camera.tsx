import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import Book from "@/constants/Book";

// export default interface Book {
//   title: string;
//   author: string;
//   pubYear: number;
//   numPages: number;
//   coverImgURL: string; // url
// }

// const API_KEY = 'AIzaSyBKAoyDB2sxyZtD9gZ63BaL48J3m7O7T0A';

export default function TabTwoScreen() {
  console.log("testing");

  const [ISBN, setISBN] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false); // modal is initially not visible

  // Book info
  // const [bookInfo, setBookInfo] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pubYear, setPubYear] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [coverImgURL, setCoverImgURL] = useState("");
  // const [isBookInfoRetrieved, setIsBookInfoRetrieved] = useState(false);

  async function getBookInfo(ISBN: string) {
    try {
      const book_info_response = await fetch(
        `https://openlibrary.org/isbn/${ISBN}.json`
        // `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}&key=${API_KEY}`
      );

      const book_info_json = await book_info_response.json();
      console.log(book_info_json);

      setTitle(book_info_json.title); // title = book_info_json.title;
      setNumPages(book_info_json.number_of_pages); // let number_of_pages = book_info_json.number_of_pages;
      setPubYear(book_info_json.publish_date.slice(-4)); // let pub_year = book_info_json.publish_date.slice(-4);
      let cover_id = book_info_json.covers[0];
      // let cover_img = await getCoverInfo(cover_id);
      await getCoverInfo(cover_id);

      let full_author_id = book_info_json.authors[0].key;
      var total_length: number = full_author_id.length; // "/authors/" is length 9
      var id_length: number = total_length - 9;
      var author_id: string = full_author_id.substring(id_length + 1);
      // const author_name = await getAuthorInfo(author_id);
      getAuthorInfo(author_id);

      // Each part of the book state is itself a state
      // const final_book: Book = {
      //   title: title,
      //   author: author,
      //   numPages: numPages,
      //   coverImgURL: coverImgURL,
      //   pubYear: pubYear,
      // };
      // setBookInfo(final_book);
      // console.log(bookInfo);
      // if (title && author && pubYear && numPages && coverImgURL) {
      //   setIsBookInfoRetrieved(true);
      // }
    } catch (error) {
      console.log(error);
    }
  }

  async function getCoverInfo(cover_id: any): Promise<void> {
    const cover_img_response = await fetch(
      `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`
    );
    setCoverImgURL(cover_img_response.url);
    // return cover_img_response.url;
  }

  async function getAuthorInfo(author_id: any): Promise<void> {
    const author_name_response = await fetch(
      `https://openlibrary.org/authors/${author_id}.json`
    );
    const author_name_json = await author_name_response.json();
    let author = author_name_json.alternate_names[0];
    console.log(author_name_json.alternate_names);
    setAuthor(author);
    // return author;
  }

  // useEffect that runs the moment the ISBN state changes (or is set for the first time)
  useEffect(() => {
    if (ISBN) {
      console.log(ISBN);
      getBookInfo(ISBN);
    }
  }, [ISBN]);

  useEffect(() => {
    console.log("before not-null check");
    console.log(title);
    console.log(author);
    console.log(pubYear);
    console.log(numPages);
    console.log(coverImgURL);
    if (
      title != "" &&
      author != "" &&
      pubYear != 0 &&
      numPages != 0 &&
      coverImgURL != ""
    ) {
      console.log("after not-null check");
      console.log(title);
      console.log(author);
      console.log(pubYear);
      console.log(numPages);
      console.log(coverImgURL);
      setModalVisible(!modalVisible);
    }
  }, [title, author, pubYear, numPages, coverImgURL]);

  useEffect(() => {
    // testing purposes
    console.log(coverImgURL);
  }, [coverImgURL]);

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

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          // If we can even close the modal, it means that it must be open
        }}
      >
        <View
          style={{
            // flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={bookStyles.bookInfoText}>
              The book is scanned is...
            </Text>
          </View>
          <View style={bookStyles.bookInfoView} id="book-info-display">
            <View id="image-content" style={bookStyles.coverImageView}>
              <Image
                source={{
                  uri: coverImgURL
                    ? coverImgURL
                    : "https://covers.openlibrary.org/b/id/6775003-M.jpg", // set to dummy image if coverImgURL is an empty string
                }}
                style={bookStyles.coverImage}
                width={100}
                height={100}
                resizeMode="cover"
              />
            </View>
            {/* height of text column should match image height */}
            <View id="text-content" style={bookStyles.bookMetaDataContainer}>
              <View
                style={bookStyles.bookTitleYearView}
                id="title-and-pub-year"
              >
                <Text style={bookStyles.bookTitleText}>
                  {title}
                </Text>
                <Text style={bookStyles.bookTitleText}> ({pubYear})</Text>
              </View>
              <Text style={bookStyles.bookAuthorText}>{author}</Text>
              <Text style={bookStyles.bookInfoText}>{numPages} pages</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 2,
            }}
          >
            <TouchableOpacity
              id="save-book-button"
              onPress={() => {
                console.log(`Saving book titled ${title ? title : "???"}`);
              }}
              style={{
                borderRadius: 0.5,
                backgroundColor: "lightgreen",
                padding: 6,
                marginHorizontal: 6,
              }}
            >
              <Text style={bookStyles.modalButtonText}>Save book</Text>
            </TouchableOpacity>

            <TouchableOpacity
              id="cancel-button"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={{
                borderRadius: 0.5,
                backgroundColor: "red",
                padding: 6,
                marginHorizontal: 6,
              }}
            >
              <Text style={bookStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CameraView
        style={styles.camera}
        facing={"back"}
        onBarcodeScanned={(scanningresult: BarcodeScanningResult) => {
          setISBN(scanningresult.data);
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

const bookStyles = StyleSheet.create({
  modalButtonText: {
    fontSize: 20,
    fontWeight: "condensed",
  },
  bookTitleText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  bookAuthorText: {
    fontStyle: "italic",
    fontSize: 20,
  },
  bookInfoView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    margin: 20,

    backgroundColor: "yellow",
    padding: 10,

  },
  bookTitleYearView: {
    flexDirection: "row",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "red",
  },
  bookInfoText: {
    fontSize: 20,
  },

  bookMetaDataContainer: {
    flexDirection: "column",
    marginHorizontal: 10,
    // width: '100%',
    // marginVertical: 20,
    overflow: "hidden",
    backgroundColor: "blue",
  },

  coverImage: {
    objectFit: "cover",
  },

  coverImageView: {
    overflow: "hidden",
  },
});
