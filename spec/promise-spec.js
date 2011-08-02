var h = require('./spec-helper.js');
var when = require('../index.js').when;

describe('Promise object', function () {
  describe('interface', function () {
    it('contains the required methods', function () {
      var deferred = h.delayedSuccess();
      var promise = when(deferred);
      
      expect(promise).toBeDefined();
      expect(promise.succeeds).toBeDefined();
      expect(promise.fails).toBeDefined();
      expect(promise.completes).toBeDefined();
      expect(promise.isResolved).toBeDefined();
      expect(promise.isRejected).toBeDefined();
      // Unlike the deferred object, a promise must not contain these methods
      expect(promise.resolve).toBeUndefined();
      expect(promise.reject).toBeUndefined();
    });
    
    it('can be chained through the succeeds, fails and completes methods', function () {
      var promise = when(h.delayedSuccess());
      
      // i.e., succeeds, fails and completes methods should return the a promise object
      expect(promise.succeeds().isPromise()).toEqual(true);
      expect(promise.fails().isPromise()).toEqual(true);
      expect(promise.completes().isPromise()).toEqual(true);
    });
  });
  
  describe('behaviour when status is "unfulfilled"', function () {
    describe('and changes to "resolved"', function () {
      it('runs the success and completion callbacks on success', function () {
        runs(function () {
          this.value = when(h.delayedSuccess());
          this.status = '';
          var self = this;
          
          this.value.
            succeeds(function () {
              self.status += 'a';
            }).
            succeeds(function () {
              self.status += 'b';
            }).
            fails(function () {
              self.status += 'c';
            }).
            fails(function () {
              self.status += 'd';
            }).
            completes(function () {
              self.status += 'e';
            });
        });
        
        runs(function () {
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('abe');
        });
      });
      
      it('changes the status of the deferred object', function () {
        runs(function () {
          this.value = when(h.delayedSuccess());
          expect(this.value.isResolved()).toEqual(false);
          expect(this.value.isRejected()).toEqual(false);
        });
        
        waits(200);
        
        runs(function () {
          expect(this.value.isResolved()).toEqual(true);
          expect(this.value.isRejected()).toEqual(false);
        });
      });
      
      it('passes arguments passed to the resolve method to the success and completion callback functions', function () {
        runs(function () {
          this.value = when(h.deferredSuccessReturningNumbers1to5());
          this.status = '';
          var self = this;
          
          this.value.
            succeeds(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'a';
              }
            }).
            succeeds(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'b';
              }
            }).
            fails(function () {
              self.status += 'c';
            }).
            completes(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'd';
              }
            });
          
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('abd');
        });
      });
    });
    
    describe('and changes to "rejected"', function () {
      it('runs the failure and completion callbacks on failure', function () {
        runs(function () {
          this.value = when(h.delayedFailure());
          this.status = '';
          var self = this;
          
          this.value.
            succeeds(function () {
              self.status += 'a';
            }).
            succeeds(function () {
              self.status += 'b';
            }).
            fails(function () {
              self.status += 'c';
            }).
            fails(function () {
              self.status += 'd';
            }).
            completes(function () {
              self.status += 'e';
            });
        });
        
        runs(function () {
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('cde');
        });
      });
      
      it('changes the status of the deferred object', function () {
        runs(function () {
          this.value = when(h.delayedFailure());
          expect(this.value.isResolved()).toEqual(false);
          expect(this.value.isRejected()).toEqual(false);
        });
        
        waits(200);
        
        runs(function () {
          expect(this.value.isResolved()).toEqual(false);
          expect(this.value.isRejected()).toEqual(true);
        });
      });
      
      it('passes arguments passed to the reject method to the failure and completion callback functions', function () {
        runs(function () {
          this.value = when(h.deferredFailureReturningNumbers1to5());
          this.status = '';
          var self = this;
          
          this.value.
            fails(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'a';
              }
            }).
            fails(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'b';
              }
            }).
            succeeds(function () {
              self.status += 'c';
            }).
            completes(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'd';
              }
            });
          
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('abd');
        });
      });
    });
  });
  
  
  describe('behaviour when status is either "resolved" or "rejected"', function () {
    it('executes any new success/completion callbacks immediately when the status is "resolved"', function () {
      runs(function () {
        this.value = when(h.delayedSuccess());
        this.status = '';
        var self = this;
        
        this.value.
          succeeds(function () {
            self.status += 'a';
          }).
          succeeds(function () {
            self.status += 'b';
          });
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        expect(this.value.isResolved()).toEqual(true);
        expect(this.status).toEqual('ab');
        
        var status = '',
            self = this;
        
        this.value.succeeds(function () {
          self.status += 'c';
        });
        
        expect(this.status).toEqual('abc');
        
        this.value.completes(function () {
          self.status += 'd';
        });
        
        expect(this.status).toEqual('abcd');
      });
    });

    it('executes any new failure/completion callbacks immediately when the status is "rejected"', function () {
      runs(function () {
        this.value = when(h.delayedFailure());
        this.status = '';
        var self = this;
        
        this.value.
          fails(function () {
            self.status += 'a';
          }).
          fails(function () {
            self.status += 'b';
          });
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        expect(this.value.isRejected()).toEqual(true);
        expect(this.status).toEqual('ab');
        
        var status = '',
            self = this;
        
        this.value.fails(function () {
          self.status += 'c';
        });
        
        expect(this.status).toEqual('abc');
        
        this.value.completes(function () {
          self.status += 'd';
        });
        
        expect(this.status).toEqual('abcd');
      });
    });
    
    
    it('passes arguments that were passed to the resolve method, to the success and completion callback functions', function () {
      runs(function () {
        this.value = when(h.deferredSuccessReturningNumbers1to5());
        this.status = '';
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        var self = this;
        
        this.value.
          succeeds(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'a';
            }
          }).
          succeeds(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'b';
            }
          }).
          fails(function () {
            self.status += 'c';
          }).
          completes(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'd';
            }
          });
        
        expect(this.value.isResolved()).toEqual(true);
        expect(this.status).toEqual('abd');
      });
    });
    
    it('passes arguments that were passed to the reject method, to the failure and completion callback functions', function () {
      runs(function () {
        this.value = when(h.deferredFailureReturningNumbers1to5());
        this.status = '';
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        var self = this;
        
        this.value.
          fails(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'a';
            }
          }).
          fails(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'b';
            }
          }).
          succeeds(function () {
            self.status += 'c';
          }).
          completes(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'd';
            }
          });
        
        expect(this.value.isRejected()).toEqual(true);
        expect(this.status).toEqual('abd');
      });
    })
  });

});
