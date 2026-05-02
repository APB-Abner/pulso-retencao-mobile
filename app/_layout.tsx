import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="consultor"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="missoes/[id]"
        options={{
          title: "Ficha da missão",
        }}
      />

      <Stack.Screen
        name="cartao"
        options={{
          title: "Cartão de Recuperação",
        }}
      />
    </Stack>
  );
}
