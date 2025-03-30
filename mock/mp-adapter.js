export const wxRequestInterceptor = () => {
    const originalRequest = wx.request;

    wx.request = function(config) {
        const mockResponse = BetterMock.mock(config);

        return mockResponse ?
            Promise.resolve(mockResponse) :
            originalRequest(config);
    };
};