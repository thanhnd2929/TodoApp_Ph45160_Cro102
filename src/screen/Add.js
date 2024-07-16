import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';



const Add = ({route}) => {
  const { getApi} = route.params
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const navigation = useNavigation();


  const handleAddTask = async () => {
    if (title && content) {
      try {
        const response = await fetch('http://10.0.2.2:3000/works', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: title,
            content: content,
            status: false
          })
        });

        if (response.ok) {
          getApi()
          navigation.goBack();
          ToastAndroid.show('Thêm thành công', ToastAndroid.SHORT);
        } else {
          console.log('Failed to add task');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Điền đầy đủ thông tin');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '' }}>
      <Text style={{ color: '#9395D3', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 70, marginBottom: 20 }}>Add Task</Text>
      <TextInput style={styles.input} placeholder='Title' value={title} onChangeText={txt => setTitle(txt)} />
      <TextInput style={styles.input} placeholder='Content' value={content} onChangeText={txt => setContent(txt)} />
      <TouchableOpacity
        onPress={() => handleAddTask()}
        style={{ padding: 16, width: '80%', backgroundColor: '#9395D3', borderRadius: 20, alignSelf: 'center', marginTop: 20 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 20 }}>
          ADD
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Add

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#CFD2FB',
    borderRadius: 10,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 10
  }
})