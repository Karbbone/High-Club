import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Platform,
  View,
} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Video } from 'expo-av'
import { api } from '@/services/api';


async function fetchLastPosts() {
  const res = await api.get('instagram/latest')
  if (res.statusText !== 'OK') throw new Error('Erreur serveur Instagram')
  return res.data as {
    id: string
    media_url: string
    permalink: string
    caption: string
    is_video: boolean
    video_url?: string
  }[]
}

export default function HomeScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['igLast5'],
    queryFn: fetchLastPosts,
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    )
  }

  if (error || !data) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle">{String(error)}</ThemedText>
      </ThemedView>
    )
  }

  return (
    <FlatList
    data={data}
    keyExtractor={(it) => it.id}
    contentContainerStyle={styles.list}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <ThemedView style={styles.fab}>
          <ThemedText style={styles.fabIcon}>🎬</ThemedText>
        </ThemedView>
        {item.is_video ? (
          <Video
            source={{ uri: item.video_url }}
            style={styles.image}
            useNativeControls
            isLooping
          />
        ) : (
          <Image source={{ uri: item.media_url }} style={styles.image} />
        )}
        <ThemedText style={styles.caption} numberOfLines={5}>
          {item.caption || 'Événement'}
        </ThemedText>
        <Pressable
          style={styles.igBtn}
          onPress={() => Linking.openURL(item.permalink)}
        >
          <ThemedText style={styles.igBtnText}>Voir sur Instagram</ThemedText>
        </Pressable>
      </View>
    )}
    showsVerticalScrollIndicator={false}
  />
  )
}

const GAP = 12
const WIDTH = Dimensions.get('window').width - GAP * 2

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: GAP },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 12,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  image: {
    width: WIDTH,
    height: WIDTH,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  caption: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: 14,
    color: '#222',
  },
  igBtn: {
    marginTop: 10,
    marginHorizontal: 14,
    backgroundColor: '#E1306C',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  igBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  fab: {
    position: "absolute",
    right: 24,
    top: Platform.OS === "ios" ? 56 : 24, // ← plus haut sur iOS
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    elevation: 40,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  }
})
