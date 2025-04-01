import BetterMock from 'better-mock';
import {parseQueryParams} from "@/mock/utils/mock-utils";

const BASE_URL = 'http://localhost:5173'


BetterMock.mock(BASE_URL + '/getLawyerInfoById', 'GET', (options) => {
    let params = parseQueryParams(options.url);
    if (params.id != null) {
        let dataById = MOCK_LAWYER_INFO.data.filter(item => item.id === params.id);
        return {
            code: 200,
            data: dataById[0]

        }
    }
    return MOCK_LAWYER_INFO;
});


const MOCK_LAWYER_INFO = {
    code: 200,
    data: [
        {
            id: '111',
            lawfirm: '天同律师事务所',
            lawyerlicensenumber: '11101202010123456',
            specialtyname: '民商事诉讼',
            description: '擅长合同纠纷、公司股权争议等复杂案件',
            address: '北京市朝阳区建国路108号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'
        },
        {
            id: '222',
            lawyername: '金杜律师',
            lawfirm: '金杜律师事务所',
            lawyerlicensenumber: '11101201810056789',
            specialtyname: '跨境并购',
            description: '专注于跨国企业并购重组及海外投资法律事务',
            address: '上海市浦东新区世纪大道100号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'

        },
        {
            id: '333',
            lawyername: '中伦律师',
            lawfirm: '中伦律师事务所',
            lawyerlicensenumber: '11102201911234567',
            specialtyname: '知识产权',
            description: '提供专利、商标、著作权全流程法律服务',
            address: '广州市天河区珠江新城华夏路49号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'

        },
        {
            id: '444',
            lawyername: '君合律师',
            lawfirm: '君合律师事务所',
            lawyerlicensenumber: '11103202120345678',
            specialtyname: '刑事辩护',
            description: '代理重大疑难刑事案件及职务犯罪案件',
            address: '深圳市福田区福华三路168号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'
        },
        {
            id: '555',
            lawyername: '大成律师',
            lawfirm: '大成律师事务所',
            lawyerlicensenumber: '11104201710456789',
            specialtyname: '劳动仲裁',
            description: '处理劳动合同纠纷及集体劳动争议案件',
            address: '成都市高新区天府三街198号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'
        },
        {
            id: '666',
            lawyername: '国浩律师',
            lawfirm: '国浩律师事务所',
            lawyerlicensenumber: '11105202211567890',
            specialtyname: '金融证券',
            description: '擅长上市公司IPO及债券发行法律业务',
            address: '杭州市上城区解放东路45号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'
        },
        {
            id: '777',
            lawyername: '锦天城律师',
            lawfirm: '锦天城律师事务',
            lawyerlicensenumber: '11106201610678901',
            specialtyname: '房地产与建设工程',
            description: '专注于房地产开发及工程总承包法律服务',
            address: '南京市建邺区江东中路359号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'

        },
        {
            id: '888',
            lawyername: '环球律师',
            lawfirm: '环球律师事务所',
            lawyerlicensenumber: '11107202320789012',
            specialtyname: '反垄断与反不正当竞争',
            description: '提供经营者集中申报及竞争法合规服务',
            address: '武汉市武昌区中北路1号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'

        },
        {
            id: '999',
            lawyername: '方达律师',
            lawfirm: '方达律师事务所',
            lawyerlicensenumber: '11108201510890123',
            specialtyname: '数据合规',
            description: '协助企业处理数据安全及隐私保护事务',
            address: '重庆市渝中区瑞天路56号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'

        },
        {
            id: '101',
            lawyername: '德恒律师',
            lawfirm: '德恒律师事务所',
            lawyerlicensenumber: '11109202411901234',
            specialtyname: '婚姻家庭',
            description: '擅长离婚财产分割及子女抚养权争议解决',
            address: '西安市雁塔区锦业路1号',
            introduction: '本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。\n'
        }

    ]
};