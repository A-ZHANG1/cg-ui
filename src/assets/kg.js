export var nodesObj = {
  products: [{
    ID: '11'
  }, {
    ID: '12'
  }],
  companies: [{
    ID: 'VINET'
  }, {
    ID: 'LILAS'
  }],
  orders: [{
    ID: '10248'
  }, {
    ID: '10296'
  }, {
    ID: '10823'
  }, {
    ID: '10543'
  }, {
    ID: '10327'
  }, {
    ID: '10434'
  }, {
    ID: '10353'
  }, {
    ID: '10489'
  }, {
    ID: '10365'
  }, {
    ID: '10535'
  }, {
    ID: '10407'
  }, {
    ID: '10442'
  }, {
    ID: '10968'
  }, {
    ID: '10443'
  }, {
    ID: '10486'
  }, {
    ID: '10528'
  }, {
    ID: '10542'
  }, {
    ID: '10718'
  }, {
    ID: '10545'
  }, {
    ID: '10553'
  }],
  concepts: [{
    name: 'order'
  }, {
    name: 'startTime'
  }, {
    name: 'endTime'
  }],
  conc_prop_links: [{
    source: 'order',
    target: 'startTime'
  }, {
    source: 'order',
    target: 'endTime'
  }]

}

export var ViewPoint1 = {
  nodeCategories: ['Company', 'Order'],
  company: [
    {
      'companyId': '1',
      'name': '锐迪科微电子（上海）有限公司',
      'capital': '2200',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': '1'
    },
    {
      'companyId': '2',
      'name': '中芯国际集成电路制造（上海）有限公司',
      'capital': '219000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '3',
      'name': '上海宏力半导体制造有限公司',
      'capital': '90000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    }],
  contract: [
    {
      'name': '1009',
      'partyAName': '锐迪科微电子（上海）有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }, {
      'name': '1010',
      'partyAName': '锐迪科微电子（上海）有限公司',
      'partyBName': '上海宏力半导体制造有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }],
  capitalFlowLink: [
    {source: '锐迪科微电子（上海）有限公司', target: '1009'},
    {source: '锐迪科微电子（上海）有限公司', target: '1010'},
    {source: '1009', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '1010', target: '上海宏力半导体制造有限公司'}
  ]
}

export var ViewPoint2 = {
  nodeCategories: ['Company', 'Order'],
  company: [{
    'companyId': '1',
    'name': '锐迪科微电子（上海）有限公司',
    'capital': '2200',
    'nodeWeight': '20',
    'category': 0,
    'symbolSize': 30,
    'type': '1'
  },
  {
    'companyId': '2',
    'name': '中芯国际集成电路制造（上海）有限公司',
    'capital': '219000',
    'nodeWeight': '20',
    'category': 0,
    'symbolSize': 30,
    'type': null
  },
  {
    'companyId': '3',
    'name': '上海宏力半导体制造有限公司',
    'capital': '90000',
    'nodeWeight': '20',
    'category': 0,
    'symbolSize': 30,
    'type': null
  },
  {
    'companyId': '4',
    'name': '威宇科技测试封装有限公司',
    'capital': '3235',
    'nodeWeight': '20',
    'category': 0,
    'symbolSize': 30,
    'type': null
  }],
  contract: [
    {
      'name': '#2009',
      'partyAName': '上海宏力半导体制造有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }, {
      'name': '#2010',
      'partyAName': '威宇科技测试封装有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }, {
      'name': '#2011',
      'partyAName': '锐迪科微电子（上海）有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }
  ],
  capitalFlowLink: [

    {source: '锐迪科微电子（上海）有限公司', target: '#2011'},
    {source: '#2011', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '#2010', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '#2009', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '上海宏力半导体制造有限公司', target: '#2009'},
    {source: '威宇科技测试封装有限公司', target: '#2010'}
  ]
}

export var ViewMerging = {
   nodeCategories: ['Company', 'Order', 'SemanticRelation'],
   company: [
    {
      'companyId': '1',
      'name': '锐迪科微电子（上海）有限公司',
      'capital': '2200',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': '1'
    },
    {
      'companyId': '2',
      'name': '中芯国际集成电路制造（上海）有限公司',
      'capital': '219000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '3',
      'name': '上海宏力半导体制造有限公司',
      'capital': '90000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '4',
      'name': '威宇科技测试封装有限公司',
      'capital': '3235',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '5',
      'name': '菲尼萨光科技(上海)有限公司',
      'capital': '3530',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    }
  ],
   contract: [
    {
      'name': '1009',
      'partyAName': '锐迪科微电子（上海）有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }, {
      'name': '1010',
      'partyAName': '锐迪科微电子（上海）有限公司',
      'partyBName': '上海宏力半导体制造有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }, {
      'name': '#2009',
      'partyAName': '上海宏力半导体制造有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }, {
      'name': '#2010',
      'partyAName': '威宇科技测试封装有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }, {
      'name': '#2011',
      'partyAName': '锐迪科微电子（上海）有限公司',
      'partyBName': '中芯国际集成电路制造（上海）有限公司',
      'amount': '99456.97',
      'startTime': '2017-10-27 06:10:18',
      'endTime': '2019-09-18 15:16:49',
      'location': '张江',
      'type': '0',
      'symbolSize': 20,
      'category': 1
    }
  ],
  // 箭头方向为资金流动方向
  capitalFlowLink: [
    {source: '锐迪科微电子（上海）有限公司', target: '1009'},
    {source: '锐迪科微电子（上海）有限公司', target: '1010'},
    {source: '锐迪科微电子（上海）有限公司', target: '#2011'},
    {source: '#2011', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '1009', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '#2010', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '#2009', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '1010', target: '上海宏力半导体制造有限公司'},
    {source: '上海宏力半导体制造有限公司', target: '#2009'},
    {source: '威宇科技测试封装有限公司', target: '#2010'}
  ],
  sameAsRel: [
    {name: 'SameAs', category: 2, symbolSize: 10}
  ],
  sameAsLink: [
    {source: 'SameAs',
      target: '#2011',
      lineStyle: {
        normal: {
          // type: 'dashed',
          type: 'dotted',
          dashed: 0.3,
          symbolSize: 0,
          color: 'target'
        }
      }},
    {source: 'SameAs',
      target: '1009',
      lineStyle: {
        normal: {
          type: 'dashed',
          // type: 'dotted',
          dashed: 0.3,
          symbolSize: 0,
          color: 'target'
        }
      }}
  ]
}

export var subGraph1 = [{
  nodeCategories: ['Company', 'Order', 'SemanticRelation'],
  company: [
    {
      'companyId': '1',
      'name': '锐迪科微电子（上海）有限公司',
      'capital': '2200',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': '1'
    },
    {
      'companyId': '2',
      'name': '中芯国际集成电路制造（上海）有限公司',
      'capital': '219000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '3',
      'name': '上海宏力半导体制造有限公司',
      'capital': '90000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '4',
      'name': '威宇科技测试封装有限公司',
      'capital': '3235',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    }
  ],
  capitalFlowLink: [
    {source: '锐迪科微电子（上海）有限公司', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '锐迪科微电子（上海）有限公司', target: '上海宏力半导体制造有限公司'},
    {source: '上海宏力半导体制造有限公司', target: '中芯国际集成电路制造（上海）有限公司'},
    {source: '威宇科技测试封装有限公司', target: '中芯国际集成电路制造（上海）有限公司'},
  ]
}]

export var subGraph2 = [{
  nodeCategories: ['Company', 'Order', 'SemanticRelation'],
  company: [
    {
      'companyId': '1',
      'name': '锐迪科微电子（上海）有限公司',
      'capital': '2200',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': '1'
    },
    {
      'companyId': '2',
      'name': '中芯集成电路',
      'capital': '219000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '3',
      'name': '上海宏力半导体制造有限公司',
      'capital': '90000',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    },
    {
      'companyId': '4',
      'name': '威宇科技测试封装有限公司',
      'capital': '3235',
      'nodeWeight': '20',
      'category': 0,
      'symbolSize': 30,
      'type': null
    }
  ],
  capitalFlowLink: [
    {source: '锐迪科微电子（上海）有限公司', target: '中芯集成电路'},
    {source: '锐迪科微电子（上海）有限公司', target: '上海宏力半导体制造有限公司'},
    {source: '上海宏力半导体制造有限公司', target: '中芯集成电路'},
    {source: '威宇科技测试封装有限公司', target: '中芯集成电路'}
  ]
}]
