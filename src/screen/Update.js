import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const Update = ({ route }) => {
  const { item, getApi } = route.params;
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [status, setStatus] = useState(item.status);
  const navigation = useNavigation();

  const updateItem = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/works/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          content: content,
          status: status
        })
      });
      if (response.ok) {
        ToastAndroid.show('Cập nhật thành công!', ToastAndroid.SHORT);
        getApi(); // refresh the data in the previous screen
        navigation.goBack();
      } else {
        ToastAndroid.show('Cập nhật thất bại!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '' }}>
      <Text style={{ color: '#9395D3', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 70, marginBottom: 20 }}>Update Task</Text>
      <TextInput style={styles.input} placeholder='Title' value={title} onChangeText={txt => setTitle(txt)} />
      <TextInput style={styles.input} placeholder='Content' value={content} onChangeText={txt => setContent(txt)} />
     
      <TouchableOpacity
        onPress={updateItem}
        style={{ padding: 16, width: '80%', backgroundColor: '#9395D3', borderRadius: 20, alignSelf: 'center', marginTop: 20 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 20 }}>
          UPDATE
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Update;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#CFD2FB',
    borderRadius: 10,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
});
