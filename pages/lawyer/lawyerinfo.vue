
<template>
  <div class="lawyer-info">
    <div class="lawyer-avatar">
      <img :src="lawyer.avatar" alt="律师头像" />
    </div>
    <div class="lawyer-details">
      <h2>{{ lawyer.name }}</h2>
      <p>{{ lawyer.title }}</p>
      <p>{{ lawyer.experience }}年经验</p>
      <p>擅长领域: {{ lawyer.expertise.join(', ') }}</p>
      <p>执业证号: {{ lawyer.licenseNumber }}</p>
      <p>联系方式: {{ lawyer.contact }}</p>
    </div>
  </div>
</template>

<script>export default {
  data() {
    return {
      lawyer: {
        avatar: 'https://via.placeholder.com/150', // 律师头像URL
        name: '张三', // 律师姓名
        title: '高级律师', // 律师职称
        experience: 10, // 执业年限
        expertise: ['公司法', '合同法', '知识产权'], // 擅长领域
        licenseNumber: '123456789', // 执业证号
        contact: '13800138000' // 联系方式
      }
    };
  }
};
</script>

<style scoped>.lawyer-info {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.lawyer-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.lawyer-details {
  flex: 1;
}

.lawyer-details h2 {
  margin: 0 0 10px;
  font-size: 24px;
}

.lawyer-details p {
  margin: 5px 0;
  font-size: 16px;
  color: #666;
}
</style>