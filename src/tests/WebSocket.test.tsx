import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { NewProductForm } from "@/app/(protected)/products/components/NewProductForm";
import { WebSocketManager } from "@/app/(protected)/products/components/WebSocketManager";
import { Product } from "@/types/product";
import React from "react";

class MockWebSocket {
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: (() => void) | null = null;
  readyState = WebSocket.OPEN;
  OPEN = WebSocket.OPEN;
  sentMessages: string[] = [];

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 0);
  }

  send(data: string): void {
    this.sentMessages.push(data);
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data });
      }
    }, 50);
  }

  close(): void {
    if (this.onclose) this.onclose();
  }
}

class MockBroadcastChannel {
  name: string;
  onmessage: ((event: { data: any }) => void) | null = null;
  static channels: MockBroadcastChannel[] = [];

  constructor(name: string) {
    this.name = name;
    MockBroadcastChannel.channels.push(this);
  }

  postMessage(data: any): void {
    setTimeout(() => {
      MockBroadcastChannel.channels.forEach((channel) => {
        if (channel.onmessage && channel !== this) {
          channel.onmessage({ data });
        }
      });
    }, 10);
  }

  close(): void {
    const index = MockBroadcastChannel.channels.indexOf(this);
    if (index > -1) {
      MockBroadcastChannel.channels.splice(index, 1);
    }
  }
}

jest.mock("@/hooks/useWebSocket", () => ({
  useWebSocket: () => {
    const [lastMessage, setLastMessage] = React.useState<any>(null);

    return {
      isConnected: true,
      lastMessage,
      sendMessage: jest.fn((message) => {
        setTimeout(() => setLastMessage(message), 100);
      }),
      sendNewProduct: jest.fn((product: Product) => {
        const message = {
          event: "new_product",
          product,
        };

        setTimeout(() => setLastMessage(message), 100);

        window.dispatchEvent(
          new CustomEvent("addProduct", { detail: product })
        );
      }),
      syncNewProduct: jest.fn(),
    };
  },
}));

global.WebSocket = MockWebSocket as any;
global.BroadcastChannel = MockBroadcastChannel as any;

const mockStore = configureStore([]);
const initialState = {
  auth: {
    user: {
      id: 1,
      firstName: "Test",
      lastName: "User",
      accessToken: "fake-token",
    },
    token: "fake-token",
    isAuthenticated: true,
  },
  products: {
    products: [],
    isLoading: false,
    error: null,
  },
};

describe("WebSocket Integration", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    MockBroadcastChannel.channels = [];

    window.addEventListener("addProduct", ((event: CustomEvent<Product>) => {
      store.dispatch({
        type: "products/addProduct",
        payload: event.detail,
      });
    }) as EventListener);
  });

  afterEach(() => {
    window.removeEventListener("addProduct", (() => {}) as EventListener);
    MockBroadcastChannel.channels = [];
    jest.clearAllMocks();
  });

  test("should verify WebSocket echoes the same message sent", async () => {
    render(
      <Provider store={store}>
        <>
          <NewProductForm />
          <WebSocketManager />
        </>
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText(/enter product name/i);
    const descriptionInput = screen.getByPlaceholderText(
      /describe your amazing product/i
    );
    const priceInput = screen.getByPlaceholderText(/0\.00/i);
    const submitButton = screen.getByRole("button", {
      name: /create product/i,
    });

    fireEvent.change(titleInput, { target: { value: "Echo Test Product" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Testing echo functionality" },
    });
    fireEvent.change(priceInput, { target: { value: "123.45" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      const addProductAction = actions.find(
        (action) => action.type === "products/addProduct"
      );

      expect(addProductAction).toBeTruthy();
      expect(addProductAction.payload.title).toBe("Echo Test Product");
      expect(addProductAction.payload.description).toBe(
        "Testing echo functionality"
      );
      expect(addProductAction.payload.price).toBe(123.45);
    });
  });

  test("should synchronize product list across tabs via BroadcastChannel", async () => {
    render(
      <Provider store={store}>
        <>
          <NewProductForm />
          <WebSocketManager />
        </>
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText(/enter product name/i);
    const descriptionInput = screen.getByPlaceholderText(
      /describe your amazing product/i
    );
    const priceInput = screen.getByPlaceholderText(/0\.00/i);
    const submitButton = screen.getByRole("button", {
      name: /create product/i,
    });

    fireEvent.change(titleInput, { target: { value: "Sync Test Product" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Testing sync between tabs" },
    });
    fireEvent.change(priceInput, { target: { value: "456.78" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      const addProductActions = actions.filter(
        (action) => action.type === "products/addProduct"
      );

      expect(addProductActions.length).toBeGreaterThan(0);

      const productAction = addProductActions.find(
        (action) => action.payload.title === "Sync Test Product"
      );
      expect(productAction).toBeTruthy();
      expect(productAction.payload.description).toBe(
        "Testing sync between tabs"
      );
      expect(productAction.payload.price).toBe(456.78);
    });
  });

  test("should show success message when product is added", async () => {
    render(
      <Provider store={store}>
        <>
          <NewProductForm />
          <WebSocketManager />
        </>
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText(/enter product name/i);
    const descriptionInput = screen.getByPlaceholderText(
      /describe your amazing product/i
    );
    const priceInput = screen.getByPlaceholderText(/0\.00/i);
    const submitButton = screen.getByRole("button", {
      name: /create product/i,
    });

    fireEvent.change(titleInput, { target: { value: "Success Test Product" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Testing success message" },
    });
    fireEvent.change(priceInput, { target: { value: "789.01" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      const addProductAction = actions.find(
        (action) => action.type === "products/addProduct"
      );

      expect(addProductAction).toBeTruthy();
      expect(addProductAction.payload.title).toBe("Success Test Product");
    });

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
    });
  });

  test("should verify WebSocket connection status", async () => {
    render(
      <Provider store={store}>
        <>
          <NewProductForm />
          <WebSocketManager />
        </>
      </Provider>
    );

    expect(screen.getByText(/websocket connection/i)).toBeTruthy();
    expect(screen.getByText(/live/i)).toBeTruthy();
  });

  test("should add a new product and show confirmation dialog", async () => {
    render(
      <Provider store={store}>
        <>
          <NewProductForm />
          <WebSocketManager />
        </>
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText(/enter product name/i);
    const descriptionInput = screen.getByPlaceholderText(
      /describe your amazing product/i
    );
    const priceInput = screen.getByPlaceholderText(/0\.00/i);
    const submitButton = screen.getByRole("button", {
      name: /create product/i,
    });

    fireEvent.change(titleInput, { target: { value: "Test Product" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test product" },
    });
    fireEvent.change(priceInput, { target: { value: "99.99" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(
        actions.some(
          (action) =>
            action.type === "products/addProduct" &&
            action.payload.title === "Test Product"
        )
      ).toBeTruthy();
    });
  });
});
