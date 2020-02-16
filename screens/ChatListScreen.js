import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import Firebase from '../firebase';
import { CurrentUser } from '../helper';

export default class ChatListScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Messages'
  }

  state = {
    users: [],
    chats: []
  };

  startChat = (item) => {
    this.props.navigation.navigate("ChatScreen", { to: item });
  }

  componentDidMount() {
    this.firebaseItemsLister = Firebase.onMessagesChange((data) => {
      data = data.val();
      let chats = []
      for (let key in data) {
        let item = data[key];
        if ((item.to == CurrentUser.get()) && (!chats.includes(item.user.name)) && (item.user.name != CurrentUser.get())) {
          chats.push(item.user.name)
        } else if ((item.user.name == CurrentUser.get()) && (!chats.includes(item.to)) && (item.to != CurrentUser.get())) {
          chats.push(item.to)
        }
      }
      this.setState({ chats: chats });
    });

    this.firebaseItemsLister = Firebase.onUsersChange((data) => {
      data = data.val();
      let users = [];
      for (let key in data) {
        let item = data[key];
        users.push({ username: key, chats: item.chat });
      }
      this.setState({ users });
    });
  }

  componentWillUnmount() {
    Firebase.off(this.firebaseItemsLister);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>

        {/* <View style={styles.chatView}>
          <Text style={styles.chatText}>
            Chats
          </Text>
        </View> */}

        <View style={styles.listView}>
          <FlatList
            keyExtractor={(item) => item}
            style={styles.list}
            data={this.state.chats}
            renderItem={({ item }) =>
              <TouchableOpacity style={styles.conversation}
                onPress={() => this.startChat(item)}>
                <Text style={styles.conversationText}>
                  {item}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

// function findChats(chats) {
//   let out = chat.split(',')
//   console.log(out)
//   return out.filter(v => v !== '');
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatView: {
    flex: 1
  },
  chatText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#514E5A',
  },
  listView: {
    flex: 11
  },
  conversation: {
    height: 50,
    width: 370,
    backgroundColor: "#eee",
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  conversationText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#514E5A',
  },
});