import { Link } from 'expo-router'
import { Text, View } from 'react-native'

const signin = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link href="/(auth)/sign-up">Sign Up</Link>
    </View>
  )
}

export default signin