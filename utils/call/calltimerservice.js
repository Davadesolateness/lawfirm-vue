class CallTimerService {
    constructor() {
        // 初始化原生插件
        this.callPlugin = uni.requireNativePlugin('CallPlugin');
        this.timerPlugin = uni.requireNativePlugin('TimerPlugin');

        // 状态变量
        this.callState = 'idle'; // idle, dialing, active, ended
        this.callDuration = 0;
        this.phoneNumber = '';
        this.startTime = null;

        // 事件监听器集合
        this.listeners = {
            stateChange: [],
            timerUpdate: [],
            callEnded: []
        };

        // 注册全局事件监听
        this._registerGlobalEvents();
    }

    // 注册全局事件监听
    _registerGlobalEvents() {
        // 监听计时器更新
        uni.$on('timer_update', (data) => {
            this.callDuration = data.currentTime;
            this._notifyListeners('timerUpdate', this.callDuration);
        });

        // 监听通话状态变化
        uni.$on('call_state_change', (data) => {
            this.callState = data.state;
            this._notifyListeners('stateChange', this.callState);

            // 通话结束时处理
            if (data.state === 'ended') {
                this.stopTimer();
                this._notifyListeners('callEnded', {
                    phoneNumber: this.phoneNumber,
                    duration: this.callDuration,
                    startTime: this.startTime,
                    endTime: new Date()
                });
            }
        });
    }

    // 通知所有监听器
    _notifyListeners(eventType, data) {
        this.listeners[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`CallTimerService ${eventType} listener error:`, error);
            }
        });
    }

    // 添加事件监听器
    on(eventType, callback) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].push(callback);
        } else {
            console.warn(`Invalid event type: ${eventType}`);
        }
        return this; // 支持链式调用
    }

    // 移除事件监听器
    off(eventType, callback) {
        if (this.listeners[eventType]) {
            this.listeners[eventType] = this.listeners[eventType].filter(
                cb => cb !== callback
            );
        }
        return this;
    }

    // 拨打电话
    makeCall(phoneNumber) {
        // 验证电话号码格式
        if (!this._validatePhoneNumber(phoneNumber)) {
            this._notifyListeners('stateChange', 'invalid_number');
            return false;
        }

        this.phoneNumber = phoneNumber;
        this.startTime = new Date();

        // 重置计时器
        this.resetTimer();

        // 调用原生拨号
        this.callPlugin.makeCall(phoneNumber);

        // 更新状态
        this.callState = 'dialing';
        this._notifyListeners('stateChange', 'dialing');

        // 启动计时器
        this.startTimer();

        return true;
    }

    // 结束通话
    endCall() {
        // 调用原生结束通话方法
        this.callPlugin.endCall();

        // 更新状态
        this.callState = 'ended';
        this._notifyListeners('stateChange', 'ended');

        return true;
    }

    // 开始计时
    startTimer() {
        this.timerPlugin.startTimer();
        return this;
    }

    // 停止计时
    stopTimer() {
        this.timerPlugin.stopTimer();
        return this;
    }

    // 重置计时
    resetTimer() {
        this.timerPlugin.resetTimer();
        this.callDuration = 0;
        this._notifyListeners('timerUpdate', 0);
        return this;
    }

    // 获取当前通话时长
    getCurrentDuration() {
        return this.callDuration;
    }

    // 获取格式化时间
    getFormattedTime() {
        const minutes = Math.floor(this.callDuration / 60);
        const seconds = this.callDuration % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 获取当前通话状态
    getCallState() {
        return this.callState;
    }

    // 验证电话号码
    _validatePhoneNumber(phoneNumber) {
        // 中国大陆手机号验证
        return /^1[3-9]\d{9}$/.test(phoneNumber);
    }

    // 销毁资源
    destroy() {
        // 停止计时器
        this.stopTimer();

        // 移除全局事件监听
        uni.$off('timer_update');
        uni.$off('call_state_change');

        // 清空监听器
        Object.keys(this.listeners).forEach(key => {
            this.listeners[key] = [];
        });
    }
}

// 创建单例实例
const callTimerService = new CallTimerService();

// 导出单例
export default callTimerService;