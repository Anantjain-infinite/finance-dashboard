// mock network latency like a real API would have.

export function mockDelay(min = 300, max = 700) {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  )
}

// simulates a failed request
export function mockError(message = 'Something went wrong') {
  return Promise.reject(new Error(message))
}
