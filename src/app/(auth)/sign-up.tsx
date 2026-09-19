import { Link } from 'expo-router'
import { Text, View } from 'react-native'

const signup = () => {
    return (
        <View>
            <Text>sign-in</Text>
            <Link href="/(auth)/sign-in">SignIn</Link>
        </View>
    )
}

export default signup