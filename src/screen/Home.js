import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, FlatList } from 'react-native';

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const initialState = {
    trueCount: 0,
    falseCount: 0,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'TANG':
        return { ...state, trueCount: state.trueCount + 1 };
      case 'GIAM':
        return { ...state, falseCount: state.falseCount + 1 };
      case 'reset':
        return initialState;
      default:
        throw new Error('lỗi');
    }
  };

  const [countState, dispatch] = useReducer(reducer, initialState);

  const getApi = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/works')
      const data = await response.json()
      setData(data);
      dispatch({ type: 'reset' });
      data.forEach(item => {
        if (item.status === true || item.status === 'true') {
          dispatch({ type: 'TANG' });
        } else {
          dispatch({ type: 'GIAM' });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  const deleteItem = async (id) => {
    try {
      await fetch(`http://10.0.2.2:3000/works/${id}`, {
        method: 'DELETE'
      });
      setData(data.filter(item => item.id !== id));
      getApi(); 
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, item, currentStatus) => {
    try {
      const newStatus = !currentStatus; 
      const response = await fetch(`http://10.0.2.2:3000/works/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: item.title,
          content: item.content,
          status: newStatus
        })
      });
      if (response.ok) {
        getApi(); 
      } else {
        console.log('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => {
    const status = item.status === true || item.status === 'true';
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemContent}>{item.content}</Text>
          <TouchableOpacity onPress={() => updateStatus(item.id, item, status)}>
            <Text style={[styles.itemStatus, { color: status ? 'green' : 'red' }]}>
              {status ? 'Hoàn Thành' : 'Chưa Hoàn Thành'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Update', { item, getApi })}>
            <Image style={styles.itemIcon} source={require('../img/Pencil.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteItem(item.id)}>
            <Image style={styles.itemIcon} source={require('../img/vector.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolName}>TODO APP</Text>
        <View style={styles.statusCountContainer}>
          <View style={styles.statusCount}>
            <Image source={require('../img/correct.png')} />
            <Text style={styles.statusText}>{countState.trueCount}</Text>
          </View>
          <View style={styles.statusCount}>
            <Image source={require('../img/multiply.png')} />
            <Text style={styles.statusText}>{countState.falseCount}</Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id} />
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('Add', { getApi })} style={styles.button}>
        <Image source={require('../img/plus.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D6D7EF',
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#9395D3',
    padding: 15,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusCountContainer: {
    flexDirection: 'row',
  },
  statusCount: {
    flexDirection: 'row',
    marginRight: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 4,
  },
  contentContainer: {
    padding: 20,
  },
  button: {
    width: 70,
    height: 70,
    backgroundColor: '#9395D3',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  itemContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingLeft: 16,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9395D3',
  },
  itemContent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemIcon: {
    marginHorizontal: 8,
  },
});
