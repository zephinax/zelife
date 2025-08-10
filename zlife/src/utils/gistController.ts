import { useFinanceStore } from "../store/store";

type GistOptions = {
  token: string;
  gistId: string;
  filename: string;
};

export async function fetchGistContent({
  token,
  gistId,
  filename,
}: GistOptions): Promise<string | null> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch gist: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data?.owner?.avatar_url) {
    console.log(data?.owner?.avatar_url);
    useFinanceStore.getState().setAvatarUrl(data?.owner?.avatar_url || "");
  }
  if (data?.owner?.login) {
    console.log(data?.owner?.login);
    useFinanceStore.getState().setUserName(data?.owner?.login || "");
  }
  return data.files[filename]?.content ?? null;
}

export async function updateGistContent(
  { token, gistId, filename }: GistOptions,
  content: string
): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: {
        [filename]: { content },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update gist: ${res.status} ${res.statusText}`);
  }
}

export async function createNewGist(
  token: string,
  filename: string,
  content: string,
  isPublic = false
): Promise<{ id: string; url: string }> {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public: isPublic,
      files: {
        [filename]: { content },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create gist: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return { id: data.id, url: data.html_url };
}
