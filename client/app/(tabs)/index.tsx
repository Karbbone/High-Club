import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native'


async function fetchLastPosts() {
  const res = await api.get('instagram/latest')
  if (res.status !== 200) throw new Error('Erreur lors de la récupération des derniers posts Instagram')
  return res.data as {
    id: string
    media_url: string
    permalink: string
    caption: string
    is_video: boolean
    video_url?: string
  }[]
}

function VideoCard({ item, currentVideo, setCurrentVideo }) {
  const player = useVideoPlayer(item.video_url, player => {
    player.loop = true;
  });

  const isPlaying = currentVideo === item.video_url;

  return (
    <Pressable onPress={() => setCurrentVideo(item.video_url)}>
      {isPlaying ? (
        <VideoView
          player={player}
          style={styles.image}
        />
      ) : (
        <>
          <Image source={{ uri: item.media_url }} style={styles.image} />
          <View style={styles.playOverlay}>

            <ThemedText style={styles.playIcon}>▶️</ThemedText>
          </View>
        </>
      )}
    </Pressable>
  );
}


export default function HomeScreen() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['igLast5'],
    queryFn: fetchLastPosts,
    staleTime: Infinity,
    retry: false,
  })

  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

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
        <Button
          title={isFetching ? "Rafraîchissement..." : "Rafraîchir"}
          onPress={() => refetch()}
          disabled={isFetching}
        />
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
            <VideoCard item={item} currentVideo={currentVideo} setCurrentVideo={setCurrentVideo} />
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

const GAP = 20
const WIDTH = Dimensions.get('window').width - GAP * 2

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: GAP, paddingBottom: 80 },
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
    elevation: 999,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // pour ne pas bloquer le clic
  },
  playIcon: {
    fontSize: 54,
    color: '#fff',
    elevation: 40,
    textShadowColor: '#000',
    textShadowRadius: 8,
  },
})
